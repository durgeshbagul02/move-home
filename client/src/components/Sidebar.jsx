import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isMoveFlowActive = [
    "/create-move",
    "/moving-items",
    "/vehicle-selection",
    "/price-estimate",
    "/booking-confirmation",
  ].includes(location.pathname);

  return (
    <aside className="movehome-sidebar">

      {/* BRAND */}
      <div className="movehome-sidebar-brand">
        <div className="movehome-sidebar-brand-icon">
          🏠
        </div>

        <div className="movehome-sidebar-brand-text">
          <h2>Move-Home</h2>
          <p>Digital Relocation Management</p>
        </div>
      </div>

      {/* MENU */}
      <div className="movehome-sidebar-content">

        <div className="movehome-sidebar-menu-section">
          <p className="movehome-sidebar-menu-title">
            MAIN MENU
          </p>

          <button
            className={`movehome-sidebar-menu-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <span className="movehome-sidebar-menu-icon">
              🏠
            </span>

            <span>Dashboard</span>
          </button>

          <button
            className={`movehome-sidebar-menu-item ${
              isMoveFlowActive ? "active" : ""
            }`}
            onClick={() => navigate("/create-move")}
          >
            <span className="movehome-sidebar-menu-icon">
              ＋
            </span>

            <span>Create Moving Request</span>
          </button>

          <button
            className={`movehome-sidebar-menu-item ${
              isActive("/track-move") ? "active" : ""
            }`}
            onClick={() => navigate("/track-move")}
          >
            <span className="movehome-sidebar-menu-icon">
              🚚
            </span>

            <span>Track My Move</span>
          </button>

          <button
            className={`movehome-sidebar-menu-item ${
              isActive("/booking-history") ? "active" : ""
            }`}
            onClick={() => navigate("/booking-history")}
          >
            <span className="movehome-sidebar-menu-icon">
              📋
            </span>

            <span>Booking History</span>
          </button>
        </div>

        {/* ACCOUNT */}
        <div className="movehome-sidebar-menu-section movehome-account-section">
          <p className="movehome-sidebar-menu-title">
            ACCOUNT
          </p>

          <button
            className={`movehome-sidebar-menu-item ${
              isActive("/profile") ? "active" : ""
            }`}
            onClick={() => navigate("/profile")}
          >
            <span className="movehome-sidebar-menu-icon">
              👤
            </span>

            <span>Profile</span>
          </button>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="movehome-sidebar-bottom">

        <div className="movehome-sidebar-card">

          <div className="movehome-sidebar-illustration">
            🏠 🚚
          </div>

          <h3>Moving made simple</h3>

          <p>New home. New chapter.</p>

          <p>We make your move easier.</p>

        </div>

        {/* ONLY LOGOUT */}
        <button
          className="movehome-sidebar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;