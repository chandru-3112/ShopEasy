import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./profile.css";

function Profile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await API.put("/api/users/profile", form);
      if (data.success) {
        setUser(data.user);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-wrap">
          <img src={user?.avatar} alt={user?.name} />
          <span className="avatar-badge">✏️</span>
        </div>
        <div className="profile-header-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className="joined">
            Member since {new Date(user?.createdAt).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <h3>🛍️</h3>
          <p>My Orders</p>
        </div>
        <div className="stat-card">
          <h3>{user?.isAdmin ? "✅" : "❌"}</h3>
          <p>Admin Access</p>
        </div>
        <div className="stat-card">
          <h3>⭐ 4.8</h3>
          <p>Avg Rating</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-msg">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile Info
        </button>
        <button
          className={`tab-btn ${activeTab === "address" ? "active" : ""}`}
          onClick={() => setActiveTab("address")}
        >
          📍 Address
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === "profile" && (
        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              <button
                className="edit-toggle"
                onClick={() => setEditing(!editing)}
              >
                {editing ? "Cancel" : "✏️ Edit"}
              </button>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user?.name}</p>
                )}
              </div>

              <div className="info-item">
                <label>Email</label>
                <p className="email-lock">
                  {user?.email}
                  <span>🔒 Google Login</span>
                </p>
              </div>

              <div className="info-item">
                <label>Phone</label>
                {editing ? (
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                ) : (
                  <p>{user?.phone || "Not set"}</p>
                )}
              </div>

              <div className="info-item">
                <label>Account Type</label>
                <p>{user?.isAdmin ? "👑 Admin" : "👤 Customer"}</p>
              </div>
            </div>

            {editing && (
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes ✅"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Address Tab */}
      {activeTab === "address" && (
        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Saved Addresses</h2>
              <button className="add-address-btn">+ Add New</button>
            </div>

            {user?.address?.length === 0 || !user?.address ? (
              <p style={{ color: "#aaa", fontSize: "14px" }}>
                😕 No addresses saved yet!
              </p>
            ) : (
              user.address.map((addr, i) => (
                <div
                  key={i}
                  className={`address-card ${addr.isDefault ? "default" : ""}`}
                >
                  <div className="address-top">
                    {addr.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                    <div className="address-actions">
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>
                  </div>
                  <h3>{addr.name}</h3>
                  <p>{addr.address}, {addr.city}</p>
                  <p>{addr.state} - {addr.pincode}</p>
                  <p>📞 {addr.phone}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;