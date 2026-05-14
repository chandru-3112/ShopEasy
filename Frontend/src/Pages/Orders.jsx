import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./orders.css";

const statusColor = {
  Delivered: "#27ae60",
  Shipped: "#2980b9",
  Processing: "#f39c12",
  Cancelled: "#e74c3c",
};

const statusIcon = {
  Delivered: "✅",
  Shipped: "🚚",
  Processing: "⏳",
  Cancelled: "❌",
};

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/orders/my");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) =>
    filter === "All" ? true : o.orderStatus === filter
  );

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner-large" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">📋 My Orders</h1>

      {/* Filter */}
      <div className="orders-filter">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="no-orders">
          <p>😕 No orders found!</p>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map((order, index) => (
            <div
              className="order-card"
              key={order._id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Order Header */}
              <div
                className="order-header"
                onClick={() =>
                  setExpandedId(expandedId === order._id ? null : order._id)
                }
              >
                <div className="order-id-wrap">
                  <h3>#{order._id.slice(-6).toUpperCase()}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="order-center">
                  <span
                    className="status-badge"
                    style={{
                      background: `${statusColor[order.orderStatus]}18`,
                      color: statusColor[order.orderStatus],
                    }}
                  >
                    {statusIcon[order.orderStatus]} {order.orderStatus}
                  </span>
                </div>

                <div className="order-right">
                  <p className="order-total">₹{order.totalPrice}</p>
                  <span className="expand-icon">
                    {expandedId === order._id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Order Items - Expanded */}
              {expandedId === order._id && (
                <div className="order-items">
                  <div className="items-divider" />
                  {order.items.map((item, i) => (
                    <div className="order-item" key={i}>
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=50&fit=crop";
                        }}
                      />
                      <p>{item.name}</p>
                      <span>Qty: {item.quantity}</span>
                      <p className="item-price">₹{item.price * item.quantity}</p>
                    </div>
                  ))}

                  <div className="order-footer">
                    <div className="shipping-info">
                      <p>📍 {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      <p>📞 {order.shippingAddress.phone}</p>
                    </div>
                    <p className="order-grand-total">Total: ₹{order.totalPrice}</p>
                  </div>

                  {order.orderStatus === "Processing" && (
                    <button className="cancel-btn">❌ Cancel Order</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;