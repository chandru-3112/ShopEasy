import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./products.css";
import { useCart } from "../context/CartContext";


const categories = ["All", "Electronics", "Fashion", "Home"];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, search, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== "All") params.category = activeCategory;
      if (search) params.search = search;
      if (sortBy !== "default") params.sort = sortBy;

      const { data } = await API.get("/api/products", { params });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">
        <h1>All Products</h1>
        <p>{products.length} products found</p>
      </div>

      {/* Controls */}
      <div className="products-controls">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner-large" />
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>😕 No products found!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div
              className="product-card"
              key={product._id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-img-wrap">
                <img src={product.image} alt={product.name} />
                <span className="category-badge">{product.category}</span>
              </div>
              <div className="card-body">
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>
                <div className="card-actions">
                  <Link to={`/products/${product._id}`} className="view-btn">
                    View
                  </Link>
                  <button
                    className="cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Products;