import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  shortDescription: {
    type: String,
  },

  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length >= 2;
      },
      message: "이미지는 최소 2개 이상이어야 합니다.",
    },
  },

  categories: {
    type: [String],
    default: [],
  },

  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },

  discountRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  availableSizes: {
    type: [Number],
    default: [],
  },

  materials: {
    type: [String],
    default: [],
  },

  saleStart: {
    type: Date,
  },

  saleEnd: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  totalSold: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Product", productSchema);
