import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { ensureAuth } from "../middleware/auth.js";

const router = Router();

router.use(ensureAuth);

// 장바구니 조회
router.get("/", async (req, res) => {
  try {
    const cart =
      (await Cart.findOne({ userId: req.userId }).populate(
        "items.productId"
      )) || null;

    if (!cart) {
      return res.json({ items: [] });
    }

    const items = cart.items.map((item) => {
      const product = item.productId;
      const basePrice = product?.basePrice ?? null;
      const discountRate = product?.discountRate ?? 0;
      const price =
        basePrice !== null
          ? Math.round(basePrice * (1 - (discountRate || 0) / 100))
          : null;

      return {
        id: item._id,
        productId: product?._id || item.productId,
        name: product?.name || null,
        size: item.size,
        quantity: item.quantity,
        price,
        discountRate: product?.discountRate ?? null,
        images: product?.images ?? [],
        categories: product?.categories ?? [],
      };
    });

    res.json({ items });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "장바구니를 불러오지 못했습니다." });
  }
});

// 장바구니 추가 (동일 상품+사이즈면 수량 증가)
router.post("/items", async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const parsedSize = Number(size);
    const parsedQuantity = Number(quantity);

    if (!productId || Number.isNaN(parsedSize)) {
      return res.status(400).json({ message: "상품과 사이즈를 입력해 주세요." });
    }
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "수량은 1 이상이어야 합니다." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    if (
      Array.isArray(product.availableSizes) &&
      product.availableSizes.length > 0 &&
      !product.availableSizes.includes(parsedSize)
    ) {
      return res.status(400).json({ message: "해당 사이즈는 주문할 수 없습니다." });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [],
      });
    }

    const existing = cart.items.find(
      (i) => String(i.productId) === String(productId) && i.size === parsedSize
    );

    if (existing) {
      existing.quantity += parsedQuantity;
    } else {
      cart.items.push({
        productId,
        size: parsedSize,
        quantity: parsedQuantity,
      });
    }

    await cart.save();
    return res.status(201).json({ message: "장바구니에 담겼습니다." });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "장바구니 추가에 실패했습니다." });
  }
});

// 장바구니 아이템 수정
router.patch("/items/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const parsedQuantity = Number(quantity);
    if (!parsedQuantity || parsedQuantity < 1) {
      return res.status(400).json({ message: "수량은 1 이상이어야 합니다." });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "장바구니가 없습니다." });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    item.quantity = parsedQuantity;
    await cart.save();

    return res.json({ message: "수량이 수정되었습니다." });
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ message: "장바구니 수정에 실패했습니다." });
  }
});

// 장바구니 아이템 삭제
router.delete("/items/:itemId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "장바구니가 없습니다." });
    }

    const beforeLen = cart.items.length;
    cart.items = cart.items.filter(
      (i) => String(i._id) !== String(req.params.itemId)
    );
    if (cart.items.length === beforeLen) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    await cart.save();

    return res.json({ message: "아이템이 삭제되었습니다." });
  } catch (err) {
    console.error("Delete cart item error:", err);
    res.status(500).json({ message: "장바구니 삭제에 실패했습니다." });
  }
});

export default router;
