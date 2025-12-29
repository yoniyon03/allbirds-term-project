import { Router } from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { ensureAuth } from "../middleware/auth.js";

const router = Router();

router.use(ensureAuth);

// 주문 생성 (checkout)
router.post("/checkout", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "장바구니가 비어 있습니다." });
    }

    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      if (!product) {
        return res
          .status(400)
          .json({ message: "일부 상품 정보를 찾을 수 없습니다." });
      }
      if (
        Array.isArray(product.availableSizes) &&
        product.availableSizes.length > 0 &&
        !product.availableSizes.includes(cartItem.size)
      ) {
        return res
          .status(400)
          .json({ message: `${product.name}의 해당 사이즈를 주문할 수 없습니다.` });
      }

      const priceSnapshot = Math.round(
        product.basePrice * (1 - (product.discountRate || 0) / 100)
      );

      orderItems.push({
        productId: product._id,
        nameSnapshot: product.name,
        priceSnapshot,
        size: cartItem.size,
        quantity: cartItem.quantity,
      });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.userId,
      items: orderItems,
      totalAmount,
      paidAt: new Date(),
    });

    // 주문 후 장바구니 비우기
    cart.items = [];
    await cart.save();

    return res.status(201).json({ message: "주문이 완료되었습니다.", order });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "주문 처리에 실패했습니다." });
  }
});

export default router;
