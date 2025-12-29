import { Router } from "express";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { ensureAuth } from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    return res
      .status(500)
      .json({ message: "상품 목록을 불러오지 못했습니다." });
  }
});

router.get("/sales", async (req, res) => {
  try {
    const rows = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          quantity: { $sum: "$items.quantity" },
        },
      },
      {
        $project: {
          productId: "$_id",
          quantity: 1,
        },
      },
    ]);

    return res.json(
      rows.map((r) => ({
        productId: String(r.productId),
        quantity: r.quantity,
      }))
    );
  } catch (err) {
    console.error("Public sales error:", err);
    return res
      .status(500)
      .json({ message: "상품 정보를 불러오지 못했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

    const productObj = product.toObject();
    const finalPrice = Math.round(
      product.basePrice * (1 - (product.discountRate || 0) / 100)
    );

    return res.json({ ...productObj, finalPrice });
  } catch (err) {
    console.error("Get product detail error:", err);
    return res
      .status(500)
      .json({ message: "상품 정보를 불러오지 못했습니다." });
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json(
      reviews.map((r) => ({
        id: r._id,
        title: r.title,
        rating: r.rating,
        content: r.content,
        size: r.size,
        user: r.userId
          ? { id: r.userId._id, name: r.userId.name, email: r.userId.email }
          : null,
        createdAt: r.createdAt,
      }))
    );
  } catch (err) {
    console.error("Get reviews error:", err);
    return res.status(500).json({ message: "리뷰를 불러오지 못했습니다." });
  }
});

router.post("/:productId/reviews", ensureAuth, async (req, res) => {
  try {
    const { rating, content, title, size } = req.body;
    const { productId } = req.params;

    const parsedRating = Number(rating);
    const parsedSize = Number(size);
    const sizeProvided =
      Number.isFinite(parsedSize) && !Number.isNaN(parsedSize);

    if (!parsedRating || !content || !title) {
      return res
        .status(400)
        .json({ message: "평점, 제목, 내용을 모두 입력해주세요." });
    }
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "평점은 1~5 사이여야 합니다." });
    }

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

    const existing = await Review.findOne({
      productId,
      userId: req.userId,
      ...(sizeProvided ? { size: parsedSize } : {}),
    });
    if (existing) {
      return res.status(409).json({
        message: "이미 해당 상품(해당 사이즈)에 리뷰를 작성하셨습니다.",
      });
    }

    const review = await Review.create({
      productId,
      userId: req.userId,
      rating: parsedRating,
      content,
      title,
      size: sizeProvided ? parsedSize : undefined,
    });

    return res.status(201).json({
      id: review._id,
      title: review.title,
      rating: review.rating,
      content: review.content,
      size: review.size,
      createdAt: review.createdAt,
    });
  } catch (err) {
    console.error("Create review error:", err);
    return res.status(500).json({ message: "리뷰 작성에 실패했습니다." });
  }
});

export default router;
