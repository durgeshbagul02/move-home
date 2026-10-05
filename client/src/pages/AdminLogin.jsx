import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------
      // ADMIN LOGIN
      // ----------------------------------------

      const response = await API.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Login failed."
        );

        return;
      }

      const loggedInUser =
        response.data.user;

      const token =
        response.data.token;

      // ----------------------------------------
      // CHECK ADMIN ROLE
      // ----------------------------------------

      if (
        loggedInUser?.role?.toLowerCase() !==
        "admin"
      ) {
        setError(
          "This account does not have admin access."
        );

        return;
      }

      // ----------------------------------------
      // CHECK TOKEN
      // ----------------------------------------

      if (!token) {
        setError(
          "Login successful but token was not received."
        );

        return;
      }

      // ----------------------------------------
      // CLEAR OLD SESSION
      // ----------------------------------------

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      // ----------------------------------------
      // SAVE ADMIN SESSION
      // ----------------------------------------

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          loggedInUser
        )
      );

      // ----------------------------------------
      // GO TO ADMIN DASHBOARD
      // ----------------------------------------

      navigate(
        "/admin-dashboard"
      );

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Invalid email or password.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* ======================================
          LEFT BRAND PANEL
      ======================================= */}

      <section className="admin-login-brand">

        <div className="admin-brand-content">

          <div className="admin-brand-logo">
            M
          </div>

          <h1>
            Move-Home
          </h1>

          <span>
            Admin Panel
          </span>

          <div className="admin-brand-line"></div>

          <h2>
            Manage every move
            <br />
            from one place.
          </h2>

          <p>
            Monitor bookings, manage drivers,
            assign relocation requests and
            keep the Move-Home network running
            smoothly.
          </p>

          <div className="admin-feature-list">

            <div className="admin-feature-item">
              <span>✓</span>
              <div>
                <strong>
                  Booking Management
                </strong>
                <small>
                  View and manage customer moves
                </small>
              </div>
            </div>

            <div className="admin-feature-item">
              <span>✓</span>
              <div>
                <strong>
                  Driver Assignment
                </strong>
                <small>
                  Assign drivers to bookings
                </small>
              </div>
            </div>

            <div className="admin-feature-item">
              <span>✓</span>
              <div>
                <strong>
                  Live Operations
                </strong>
                <small>
                  Monitor relocation activity
                </small>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================
          RIGHT LOGIN PANEL
      ======================================= */}

      <section className="admin-login-form-section">

        <div className="admin-login-card">

          <div className="admin-login-header">

            <div className="admin-login-icon">
              🛡️
            </div>

            <span>
              ADMIN ACCESS
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to access the
              Move-Home administration panel.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              <span>⚠</span>
              <p>{error}</p>
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="admin-login-form"
          >

            {/* EMAIL */}

            <div className="admin-form-group">

              <label htmlFor="email">
                Admin Email
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="admin-form-group">

              <div className="admin-password-label-row">

                <label htmlFor="password">
                  Password
                </label>

              </div>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="admin-show-password"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Admin Panel
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* FOOTER */}

          <div className="admin-login-footer">

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              ← Customer Login
            </button>

            <span>
              Authorized personnel only
            </span>

          </div>

        </div>

      </section>

    </div>
  );
};

export default AdminLogin;