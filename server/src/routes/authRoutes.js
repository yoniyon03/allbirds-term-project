import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일과 비밀번호를 입력하세요." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      name: name || "",
    });

    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return res
      .status(201)
      .json({ message: "회원가입 성공", user: req.session.user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일과 비밀번호를 입력하세요." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return res.json({ message: "로그인 성공", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 세션 정보 확인
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  return res.json({ user: req.session.user });
});

// 로그아웃
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res
        .status(500)
        .json({ message: "로그아웃 중 오류가 발생했습니다." });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "로그아웃 완료" });
  });
});

export default router;
