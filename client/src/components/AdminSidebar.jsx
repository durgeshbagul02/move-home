import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = ({
    isOpen,
    setIsOpen,
}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentBooking");
        localStorage.removeItem("bookingHistory");

        navigate("/admin-login");
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin-dashboard",
            icon: "📊",
        },
        {
            name: "Bookings",
            path: "/admin-dashboard",
            icon: "📦",
        },
        {
            name: "Drivers",
            path: "/admin-dashboard",
            icon: "🚚",
        },
        {
            name: "Customers",
            path: "/admin-dashboard",
            icon: "👥",
        },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() =>
                        setIsOpen(false)
                    }
                ></div>
            )}

            <aside
                className={`admin-sidebar ${
                    isOpen
                        ? "admin-sidebar-open"
                        : ""
                }`}
            >
                {/* BRAND */}
                <div className="admin-sidebar-brand">
                    <div className="admin-sidebar-logo">
                        M
                    </div>

                    <div className="admin-sidebar-brand-text">
                        <h2>Move-Home</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="admin-sidebar-nav">
                    <p className="admin-menu-title">
                        ADMIN MENU
                    </p>

                    {menuItems.map(
                        (item) => (
                            <NavLink
                                key={
                                    item.name
                                }
                                to={
                                    item.path
                                }
                                className={({
                                    isActive,
                                }) =>
                                    `admin-nav-link ${
                                        isActive
                                            ? "admin-nav-active"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setIsOpen &&
                                    setIsOpen(
                                        false
                                    )
                                }
                            >
                                <span className="admin-nav-icon">
                                    {
                                        item.icon
                                    }
                                </span>

                                <span>
                                    {
                                        item.name
                                    }
                                </span>
                            </NavLink>
                        )
                    )}
                </nav>

                {/* BOTTOM */}
                <div className="admin-sidebar-bottom">
                    <div className="admin-status-card">
                        <div className="admin-status-dot"></div>

                        <div>
                            <strong>
                                System Status
                            </strong>

                            <span>
                                Operational
                            </span>
                        </div>
                    </div>

                    <button
                        className="admin-logout-btn"
                        onClick={
                            handleLogout
                        }
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;