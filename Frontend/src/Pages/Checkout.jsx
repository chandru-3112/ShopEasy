import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const delivery = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + delivery;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.phone.trim() || form.phone.length !== 10)
      newErrors.phone = "Valid 10-digit phone required";
    if (!form.address.trim()) newErrors.address = "Address required";
    if (!form.city.trim()) newErrors.city = "City required";
    if (!form.state.trim()) newErrors.state = "State required";
    if (!form.pincode.trim() || form.pincode.length !== 6)
      newErrors.pincode = "Valid 6-digit pincode required";
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // User login check
      if (!user) {
        navigate("/login");
        return;
      }

      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: form,
        totalPrice,
        deliveryCharge: delivery,
      };

      const { data } = await API.post("/api/orders", orderData);

      if (data.success) {
        clearCart();
        setOrderPlaced(true);
        setTimeout(() => navigate("/orders"), 3000);
      }
    } catch (err) {
      console.log(err);
      alert("Order place pannala! Try again!");
    } finally {
      setLoading(false);
    }
  };

  // Cart empty check
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="not-found">
        <h2>🛒 Cart empty da!</h2>
        <button onClick={() => navigate("/products")}>
          Shop Now
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-icon">🎉</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you, {form.name}! Your order will be delivered soon.</p>
        <p className="redirect-msg">Redirecting to orders page...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {/* Steps */}
      <div className="steps">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <span>1</span> Address
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <span>2</span> Review & Pay
        </div>
      </div>

      <div className="checkout-container">

        {/* Step 1 - Address */}
        {step === 1 && (
          <div className="address-form">
            <h2>Delivery Address</h2>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="number"
                name="phone"
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                placeholder="House no, Street, Area"
                value={form.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
                rows={3}
              />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className={errors.city ? "error" : ""}
                />
                {errors.city && <span className="error-msg">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className={errors.state ? "error" : ""}
                />
                {errors.state && <span className="error-msg">{errors.state}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="number"
                name="pincode"
                placeholder="6-digit pincode"
                value={form.pincode}
                onChange={handleChange}
                className={errors.pincode ? "error" : ""}
              />
              {errors.pincode && <span className="error-msg">{errors.pincode}</span>}
            </div>

            <button className="next-btn" onClick={handleNext}>
              Continue to Review →
            </button>
          </div>
        )}

        {/* Step 2 - Review */}
        {step === 2 && (
          <div className="review-section">
            <h2>Order Review</h2>

            {/* Address Summary */}
            <div className="address-summary">
              <h3>📍 Delivering to</h3>
              <p>{form.name} — {form.phone}</p>
              <p>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
              <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
            </div>

            {/* Items */}
            <div className="review-items">
              {cartItems.map((item) => (
                <div className="review-item" key={item._id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=60&fit=crop";
                    }}
                  />
                  <div className="review-item-info">
                    <p>{item.name}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <p className="review-item-price">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="payment-method">
              <h3>💳 Payment Method</h3>
              <div className="cod-badge">✅ Cash on Delivery (COD)</div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="checkout-summary">
          <h2>Price Details</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className={delivery === 0 ? "free" : ""}>
              {delivery === 0 ? "FREE" : `₹${delivery}`}
            </span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {step === 2 && (
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "🛒 Place Order (COD)"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Checkout;