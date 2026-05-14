import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./admin.css";

const emptyForm = {
  name: "",
  price: "",
  category: "Electronics",
  stock: "",
  description: "",
  image: "",
};

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/products");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock || !form.description) {
      alert("All fields required!");
      return;
    }
    try {
      if (editId) {
        await API.put(`/api/products/${editId}`, form);
      } else {
        await API.post("/api/products", form);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image,
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed!");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">

      {/* Admin Navbar */}
      <div className="admin-navbar">
        <h1>🛒 ShopEasy Admin</h1>
        <div className="admin-nav-links">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/" className="exit-btn">Exit Admin</Link>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-card-header">
          <h2 className="admin-title">Manage Products</h2>
          <button
            className="add-btn"
            onClick={() => {
              setShowForm(!showForm);
              setForm(emptyForm);
              setEditId(null);
            }}
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="admin-form">
            <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Product name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Sports</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock quantity"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Product description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={handleChange}
              />
            </div>
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                style={{
                  width: "120px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />
            )}
            <button className="save-btn" onClick={handleSubmit}>
              {editId ? "Update Product ✅" : "Add Product ✅"}
            </button>
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          className="admin-search"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner-large" />
          </div>
        ) : (
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=40&fit=crop";
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>
                      <span className="category-tag">{product.category}</span>
                    </td>
                    <td>₹{product.price}</td>
                    <td>
                      <span className={`stock-badge ${product.stock < 20 ? "low" : ""}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-btn" onClick={() => handleEdit(product)}>
                          ✏️ Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;