const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and 30hr battery life.",
    price: 1299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    stock: 45,
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smart watch with health tracking, GPS and AMOLED display.",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    stock: 20,
  },
  {
    name: "Running Shoes",
    description: "Lightweight and comfortable running shoes for everyday use.",
    price: 999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    stock: 60,
  },
  {
    name: "Backpack",
    description: "Durable 30L backpack with laptop compartment and waterproof material.",
    price: 799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    stock: 35,
  },
  {
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with timer and keep-warm function.",
    price: 1899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    stock: 15,
  },
  {
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness and USB charging port.",
    price: 499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
    stock: 50,
  },
  {
    name: "Sunglasses",
    description: "UV400 polarized sunglasses with lightweight frame.",
    price: 599,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    stock: 40,
  },
  {
    name: "Bluetooth Speaker",
    description: "360° surround sound Bluetooth speaker with 12hr playtime.",
    price: 1599,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    stock: 25,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");

    await Product.deleteMany();
    console.log("🗑️ Old products deleted!");

    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};

seedDB();