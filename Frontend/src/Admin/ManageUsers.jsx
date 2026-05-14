import { useState } from "react";
import { Link } from "react-router-dom";
import "./admin.css";

const initialUsers = [
  { id: 1, name: "Arun Kumar", email: "arun@gmail.com", orders: 12, joined: "Jan 2024", active: true },
  { id: 2, name: "Priya S", email: "priya@gmail.com", orders: 5, joined: "Mar 2024", active: true },
  { id: 3, name: "Karthik R", email: "karthik@gmail.com", orders: 8, joined: "Feb 2024", active: false },
  { id: 4, name: "Meena V", email: "meena@gmail.com", orders: 3, joined: "Apr 2024", active: true },
  { id: 5, name: "Raj M", email: "raj@gmail.com", orders: 1, joined: "Apr 2025", active: true },
];

function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const toggleActive = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
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
        <h2 className="admin-title">Manage Users</h2>

        {/* Search */}
        <input
          type="text"
          className="admin-search"
          placeholder="🔍 Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => (
                <tr key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.orders}</td>
                  <td>{user.joined}</td>
                  <td>
                    <span className={`user-status ${user.active ? "active" : "inactive"}`}>
                      {user.active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`toggle-btn ${user.active ? "block" : "unblock"}`}
                      onClick={() => toggleActive(user.id)}
                    >
                      {user.active ? "🚫 Block" : "✅ Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ManageUsers;