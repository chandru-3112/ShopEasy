import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>🛒 ShopEasy</h2>
          <p>Best products at the best prices. Shop smart, shop easy!</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-links">
          <h3>Account</h3>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📧 support@shopeasy.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Coimbatore, Tamil Nadu</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 ShopEasy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;        