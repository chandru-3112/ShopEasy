import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./home.css";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get("/api/products");
        if (data.success) {
          // First 4 products mattum show pannuvom
          setFeaturedProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopEasy 🛒</h1>
          <p>Best products at the best prices!</p>
          <Link to="/products" className="hero-btn">Shop Now</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner-large" />
            <p>Loading...</p>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <div
                className="product-card"
                key={product._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=200&fit=crop";
                  }}
                />
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>
                <Link to={`/products/${product._id}`} className="view-btn">
                  View Product
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;