import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./admin.css";

const statusColor = {
  Delivered: "#27ae60",
  Shipped: "#2980b9",
  Processing: "#f39c12",
  Cancelled: "#e74c3c",
};

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/orders");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/api/orders/${id}`, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Status update failed!");
    }
  };

  const filtered = orders.filter((o) =>
    filter === "All" ? true : o.orderStatus === filter
  );

  return (
    <div className="admin-page">
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
        <h2 className="admin-title">Manage Orders</h2>

        <div className="filter-wrap">
          {["All", ...statusOptions].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner-large" />
          </div>
        ) : (
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.user?.name || "N/A"}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: `${statusColor[order.orderStatus]}18`,
                          color: statusColor[order.orderStatus],
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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

export default ManageOrders;