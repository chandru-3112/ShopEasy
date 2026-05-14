import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🛒 ShopEasy</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li>
          <Link to="/cart">
            Cart 🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </li>
        {user && <li><Link to="/profile">Profile</Link></li>}
      </ul>

      <div className="navbar-auth">
        {user ? (
          <div className="user-info">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <span>{user.name.split(" ")[0]}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;