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

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        API.get("/api/products"),
        API.get("/api/orders"),
        API.get("/api/users"),
      ]);

      const orders = ordersRes.data.orders || [];
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalProducts: productsRes.data.products?.length || 0,
        totalUsers: usersRes.data.users?.length || 0,
        totalRevenue,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: "📦", color: "#e44d26" },
    { label: "Total Products", value: stats.totalProducts, icon: "🛍️", color: "#2980b9" },
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#27ae60" },
    { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "💰", color: "#f39c12" },
  ];

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
        <h2 className="admin-title">Dashboard</h2>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner-large" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              {statCards.map((stat, index) => (
                <div
                  className="stat-card"
                  key={stat.label}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="stat-icon"
                    style={{
                      background: `${stat.color}18`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Recent Orders</h3>
                <Link to="/admin/orders">View All →</Link>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.user?.name || "N/A"}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;