const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Fashion", "Home", "Sports", "Other"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x300?text=Product",
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: String,
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);