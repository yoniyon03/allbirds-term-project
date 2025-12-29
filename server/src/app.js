import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import meRoutes from "./routes/meRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.send("pong");
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static(path.join(__dirname, "../public/img")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

app.use((req, res, next) => {
  console.log(`요청 들어옴: ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/me", meRoutes);
app.use("/api/admin", adminRoutes);

export default app;
