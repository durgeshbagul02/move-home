import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const profileUser = response.data.user;

        setUser(profileUser);

        setFormData({
          name: profileUser.name || "",
          email: profileUser.email || "",
          phone: profileUser.phone || "",
        });

        // Keep localStorage user data updated
        localStorage.setItem(
          "user",
          JSON.stringify(profileUser)
        );
      }
    } catch (err) {
      console.error("Profile fetch error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load profile information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number cannot be empty.");
      return;
    }

    /*
      At this stage the backend only has GET /profile.
      Therefore we update the local profile information
      until the profile update API is added.
    */

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setIsEditing(false);
    setMessage(
      "Profile information updated successfully."
    );
    setError("");
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(false);
    setMessage("");
    setError("");
  };

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    const nameParts = user.name.trim().split(" ");

    if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0) +
        nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }

    return nameParts[0].charAt(0).toUpperCase();
  };

  const formatRole = (role) => {
    if (!role) {
      return "Customer";
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />

        <main className="profile-main">
          <div className="profile-loading">
            <div className="profile-loader"></div>
            <p>Loading your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-main">

        {/* ================= TOP BAR ================= */}

        <header className="profile-topbar">

          <div>
            <p className="profile-topbar-label">
              Account
            </p>

            <h1 className="profile-topbar-title">
              Profile & Settings
            </h1>
          </div>

          <div className="profile-topbar-user">

            <div className="profile-topbar-avatar">
              {getInitials()}
            </div>

            <div className="profile-topbar-user-info">
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {formatRole(user?.role)}
              </span>
            </div>

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <section className="profile-content">

          {/* ================= PROFILE HEADER CARD ================= */}

          <div className="profile-header-card">

            <div className="profile-header-left">

              <div className="profile-large-avatar">
                {getInitials()}
              </div>

              <div className="profile-header-info">

                <h2>
                  {user?.name || "User"}
                </h2>

                <p>
                  {user?.email || "No email available"}
                </p>

                <span className="profile-role-badge">
                  {formatRole(user?.role)}
                </span>

              </div>

            </div>

            <button
              className="profile-edit-button"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
                setError("");
              }}
            >
              <span>✎</span>
              Edit Profile
            </button>

          </div>


          {/* ================= SUCCESS MESSAGE ================= */}

          {message && (
            <div className="profile-alert profile-success">
              <span className="profile-alert-icon">
                ✓
              </span>

              <span>{message}</span>
            </div>
          )}


          {/* ================= ERROR MESSAGE ================= */}

          {error && (
            <div className="profile-alert profile-error">
              <span className="profile-alert-icon">
                !
              </span>

              <span>{error}</span>
            </div>
          )}


          {/* ================= MAIN GRID ================= */}

          <div className="profile-grid">


            {/* ================= PERSONAL INFORMATION ================= */}

            <div className="profile-card">

              <div className="profile-card-header">

                <div className="profile-card-icon">
                  👤
                </div>

                <div>
                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Manage your basic account information
                  </p>
                </div>

              </div>


              <div className="profile-form">

                {/* NAME */}

                <div className="profile-field">

                  <label>
                    Full Name
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="profile-value">
                      <span className="profile-value-icon">
                        👤
                      </span>

                      <span>
                        {user?.name || "Not available"}
                      </span>
                    </div>
                  )}

                </div>


                {/* EMAIL */}

                <div className="profile-field">

                  <label>
                    Email Address
                  </label>

                  <div className="profile-value">
                    <span className="profile-value-icon">
                      ✉
                    </span>

                    <span>
                      {user?.email || "Not available"}
                    </span>
                  </div>

                  <small>
                    Email address is linked to your account.
                  </small>

                </div>


                {/* PHONE */}

                <div className="profile-field">

                  <label>
                    Phone Number
                  </label>

                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="profile-value">
                      <span className="profile-value-icon">
                        ☎
                      </span>

                      <span>
                        {user?.phone || "Not available"}
                      </span>
                    </div>
                  )}

                </div>


                {/* ROLE */}

                <div className="profile-field">

                  <label>
                    Account Role
                  </label>

                  <div className="profile-value">
                    <span className="profile-value-icon">
                      🛡
                    </span>

                    <span>
                      {formatRole(user?.role)}
                    </span>
                  </div>

                </div>


                {/* EDIT BUTTONS */}

                {isEditing && (
                  <div className="profile-form-actions">

                    <button
                      className="profile-save-button"
                      onClick={handleSave}
                    >
                      ✓ Save Changes
                    </button>

                    <button
                      className="profile-cancel-button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>

                  </div>
                )}

              </div>

            </div>


            {/* ================= ACCOUNT INFORMATION ================= */}

            <div className="profile-card">

              <div className="profile-card-header">

                <div className="profile-card-icon">
                  ⚙
                </div>

                <div>
                  <h3>
                    Account Information
                  </h3>

                  <p>
                    Details about your Move-Home account
                  </p>
                </div>

              </div>


              <div className="profile-account-details">

                <div className="profile-account-row">

                  <div className="profile-account-label">
                    <span className="profile-account-icon">
                      🆔
                    </span>

                    <span>
                      User ID
                    </span>
                  </div>

                  <span className="profile-account-value">
                    {user?._id
                      ? user._id.substring(0, 12) + "..."
                      : "Not available"}
                  </span>

                </div>


                <div className="profile-account-row">

                  <div className="profile-account-label">
                    <span className="profile-account-icon">
                      👥
                    </span>

                    <span>
                      Account Type
                    </span>
                  </div>

                  <span className="profile-account-value">
                    {formatRole(user?.role)}
                  </span>

                </div>


                <div className="profile-account-row">

                  <div className="profile-account-label">
                    <span className="profile-account-icon">
                      🔐
                    </span>

                    <span>
                      Authentication
                    </span>
                  </div>

                  <span className="profile-status-badge">
                    Protected
                  </span>

                </div>


                <div className="profile-account-row">

                  <div className="profile-account-label">
                    <span className="profile-account-icon">
                      ✓
                    </span>

                    <span>
                      Account Status
                    </span>
                  </div>

                  <span className="profile-status-badge">
                    Active
                  </span>

                </div>

              </div>

            </div>


            {/* ================= SECURITY CARD ================= */}

            <div className="profile-card profile-security-card">

              <div className="profile-card-header">

                <div className="profile-card-icon">
                  🔒
                </div>

                <div>
                  <h3>
                    Password & Security
                  </h3>

                  <p>
                    Keep your account secure
                  </p>
                </div>

              </div>


              <div className="profile-security-content">

                <div className="profile-security-item">

                  <div className="profile-security-left">

                    <div className="profile-security-icon">
                      🔑
                    </div>

                    <div>
                      <h4>
                        Password
                      </h4>

                      <p>
                        Your password is securely protected.
                      </p>
                    </div>

                  </div>

                  <button
                    className="profile-security-button"
                    onClick={() =>
                      setMessage(
                        "Password change will be available after the security API is added."
                      )
                    }
                  >
                    Change
                  </button>

                </div>


                <div className="profile-security-divider"></div>


                <div className="profile-security-item">

                  <div className="profile-security-left">

                    <div className="profile-security-icon">
                      🛡
                    </div>

                    <div>
                      <h4>
                        JWT Authentication
                      </h4>

                      <p>
                        Your session is protected using JWT authentication.
                      </p>

                    </div>

                  </div>

                  <span className="profile-security-active">
                    Active
                  </span>

                </div>

              </div>

            </div>


            {/* ================= QUICK ACTIONS ================= */}

            <div className="profile-card">

              <div className="profile-card-header">

                <div className="profile-card-icon">
                  ⚡
                </div>

                <div>
                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Quickly access important Move-Home features
                  </p>
                </div>

              </div>


              <div className="profile-quick-actions">

                <button
                  className="profile-quick-action"
                  onClick={() => navigate("/create-move")}
                >
                  <span className="profile-quick-icon">
                    🚚
                  </span>

                  <span>
                    <strong>
                      Create New Move
                    </strong>

                    <small>
                      Book a new relocation
                    </small>
                  </span>

                  <span className="profile-action-arrow">
                    →
                  </span>

                </button>


                <button
                  className="profile-quick-action"
                  onClick={() => navigate("/booking-history")}
                >
                  <span className="profile-quick-icon">
                    📋
                  </span>

                  <span>
                    <strong>
                      Booking History
                    </strong>

                    <small>
                      View your previous moves
                    </small>
                  </span>

                  <span className="profile-action-arrow">
                    →
                  </span>

                </button>


                <button
                  className="profile-quick-action"
                  onClick={() => navigate("/track-move")}
                >
                  <span className="profile-quick-icon">
                    📍
                  </span>

                  <span>
                    <strong>
                      Track My Move
                    </strong>

                    <small>
                      Monitor your active move
                    </small>
                  </span>

                  <span className="profile-action-arrow">
                    →
                  </span>

                </button>

              </div>

            </div>

          </div>


          {/* ================= FOOTER ================= */}

          <footer className="profile-footer">

            <div>
              <strong>
                Move-Home
              </strong>

              <span>
                Digital Relocation Management
              </span>
            </div>

            <p>
              Manage your account and relocation services easily.
            </p>

          </footer>

        </section>

      </main>
    </div>
  );
};

export default Profile;