import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./DriverSidebar.css";

const DriverSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentBooking");
    localStorage.removeItem("bookingHistory");

    navigate("/driver-login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/driver-dashboard",
      icon: "📊",
    },
    {
      name: "Assigned Moves",
      path: "/driver-assigned-moves",
      icon: "📦",
    },
    {
      name: "Completed Jobs",
      path: "/driver-completed-jobs",
      icon: "✅",
    },
    {
      name: "Driver Profile",
      path: "/driver-profile",
      icon: "👤",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="driver-sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`driver-sidebar ${
          isOpen ? "driver-sidebar-open" : ""
        }`}
      >
        {/* Brand */}
        <div className="driver-sidebar-brand">
          <div className="driver-logo">
            M
          </div>

          <div className="driver-brand-text">
            <h2>Move-Home</h2>
            <span>Driver Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="driver-sidebar-nav">
          <p className="driver-menu-title">
            DRIVER MENU
          </p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `driver-nav-link ${
                  isActive ? "driver-nav-active" : ""
                }`
              }
              onClick={() => setIsOpen && setIsOpen(false)}
            >
              <span className="driver-nav-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="driver-sidebar-bottom">
          <div className="driver-status-card">
            <div className="driver-status-dot"></div>

            <div>
              <strong>Driver Status</strong>
              <span>Available</span>
            </div>
          </div>

          <button
            className="driver-logout-btn"
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;