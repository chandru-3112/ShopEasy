import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productdetail.css";

const allProducts = [
  { id: 1, name: "Wireless Headphones", price: 1299, category: "Electronics", description: "Premium wireless headphones with noise cancellation and 30hr battery life.", image: "https://via.placeholder.com/400x300?text=Headphones" },
  { id: 2, name: "Smart Watch", price: 2499, category: "Electronics", description: "Feature-rich smart watch with health tracking, GPS and AMOLED display.", image: "https://via.placeholder.com/400x300?text=Smart+Watch" },
  { id: 3, name: "Running Shoes", price: 999, category: "Fashion", description: "Lightweight and comfortable running shoes for everyday use.", image: "https://via.placeholder.com/400x300?text=Shoes" },
  { id: 4, name: "Backpack", price: 799, category: "Fashion", description: "Durable 30L backpack with laptop compartment and waterproof material.", image: "https://via.placeholder.com/400x300?text=Backpack" },
  { id: 5, name: "Coffee Maker", price: 1899, category: "Home", description: "Automatic drip coffee maker with timer and keep-warm function.", image: "https://via.placeholder.com/400x300?text=Coffee+Maker" },
  { id: 6, name: "Desk Lamp", price: 499, category: "Home", description: "LED desk lamp with adjustable brightness and USB charging port.", image: "https://via.placeholder.com/400x300?text=Desk+Lamp" },
  { id: 7, name: "Sunglasses", price: 599, category: "Fashion", description: "UV400 polarized sunglasses with lightweight frame.", image: "https://via.placeholder.com/400x300?text=Sunglasses" },
  { id: 8, name: "Bluetooth Speaker", price: 1599, category: "Electronics", description: "360° surround sound Bluetooth speaker with 12hr playtime.", image: "https://via.placeholder.com/400x300?text=Speaker" },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = allProducts.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="not-found">
        <h2>😕 Product not found!</h2>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  const handleAddToCart = () => {
  addToCart({ ...product, quantity });
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
};

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-container">

        {/* Image Section */}
        <div className="detail-image-wrap">
          <img src={product.image} alt={product.name} />
          <span className="detail-badge">{product.category}</span>
        </div>

        {/* Info Section */}
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}</p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-rating">
            ⭐⭐⭐⭐☆ <span>(128 reviews)</span>
          </div>

          {/* Quantity */}
          <div className="quantity-wrap">
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="qty-count">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button
              className={`add-cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "✅ Added to Cart!" : "🛒 Add to Cart"}
            </button>
            <button
              className="buy-btn"
              onClick={() => navigate("/checkout")}
            >
              Buy Now
            </button>
          </div>

          {/* Extra Info */}
          <div className="detail-meta">
            <div className="meta-item">🚚 Free delivery on orders above ₹999</div>
            <div className="meta-item">↩️ 7 day easy return</div>
            <div className="meta-item">✅ Cash on Delivery available</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;