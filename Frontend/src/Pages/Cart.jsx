import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./cart.css";

function Cart() {
  const { cartItems, updateQty, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const delivery = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + delivery;

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>😕 Your cart is empty!</p>
          <Link to="/products" className="shop-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-container">

          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div
                className="cart-item"
                key={item._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
<img
  src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=80&fit=crop"}
  alt={item.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=80&fit=crop";
  }}
/>

                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price}</p>
                </div>

                <div className="item-qty">
                  <button onClick={() => updateQty(item._id, "dec")}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, "inc")}>+</button>
                </div>

                <p className="item-total">₹{item.price * item.quantity}</p>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

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

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {delivery !== 0 && (
              <p className="free-msg">
                Add ₹{999 - totalPrice} more for FREE delivery!
              </p>
            )}

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;