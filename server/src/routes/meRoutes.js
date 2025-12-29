import { Router } from "express";
import Order from "../models/Order.js";
import { ensureAuth } from "../middleware/auth.js";

const router = Router();

router.use(ensureAuth);

// 내 주문 목록
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "주문 내역을 불러오지 못했습니다." });
  }
});

export default router;
