import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./DriverLogin.css";

const DriverLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================================================
  // DRIVER LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // Basic validation
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // -----------------------------------------------------
      // LOGIN REQUEST
      // -----------------------------------------------------

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      // -----------------------------------------------------
      // CHECK RESPONSE
      // -----------------------------------------------------

      if (!response.data?.success) {
        setError(
          response.data?.message ||
            "Login failed. Please try again."
        );

        return;
      }

      const loggedInUser = response.data.user;
      const token = response.data.token;

      // -----------------------------------------------------
      // MAKE SURE ACCOUNT IS A DRIVER
      // -----------------------------------------------------

      if (
        !loggedInUser ||
        loggedInUser.role?.toLowerCase() !== "driver"
      ) {
        setError(
          "This account is not registered as a driver."
        );

        return;
      }

      // -----------------------------------------------------
      // CHECK TOKEN
      // -----------------------------------------------------

      if (!token) {
        setError(
          "Login successful, but authentication token was not received."
        );

        return;
      }

      // -----------------------------------------------------
      // CLEAR OLD SESSION
      // -----------------------------------------------------

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // -----------------------------------------------------
      // SAVE DRIVER SESSION
      // -----------------------------------------------------

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // -----------------------------------------------------
      // REDIRECT TO DRIVER DASHBOARD
      // -----------------------------------------------------

      navigate("/driver-dashboard");
    } catch (err) {
      console.error("Driver login error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CUSTOMER LOGIN
  // =========================================================

  const handleCustomerLogin = () => {
    navigate("/login");
  };

  // =========================================================
  // NEED HELP
  // =========================================================

  const handleHelp = () => {
    setError(
      "Please contact the Move-Home administrator for account assistance."
    );
  };

  return (
    <div className="driver-login-page">

      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <div className="driver-login-left">

        {/* BRAND */}

        <div className="driver-brand">

          <div className="driver-brand-icon">
            🏠
          </div>

          <div>
            <h2>Move-Home</h2>

            <p>
              Digital Relocation Management
            </p>
          </div>

        </div>


        {/* HERO */}

        <div className="driver-hero">

          <div className="driver-hero-icon">
            🚚
          </div>

          <h1>
            Drive with
            <span> Move-Home</span>
          </h1>

          <p>
            Manage your assigned relocation jobs,
            update move status, and help customers
            complete their journey smoothly.
          </p>


          {/* FEATURES */}

          <div className="driver-feature-list">

            {/* FEATURE 1 */}

            <div className="driver-feature">

              <div className="driver-feature-icon">
                📋
              </div>

              <div>

                <strong>
                  Manage Assigned Moves
                </strong>

                <span>
                  View and manage your relocation
                  assignments.
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="driver-feature">

              <div className="driver-feature-icon">
                📍
              </div>

              <div>

                <strong>
                  Track Your Route
                </strong>

                <span>
                  Access pickup and destination
                  information.
                </span>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="driver-feature">

              <div className="driver-feature-icon">
                🔄
              </div>

              <div>

                <strong>
                  Update Move Status
                </strong>

                <span>
                  Keep customers informed about
                  their move.
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="driver-left-footer">
          © 2026 Move-Home
        </div>

      </div>


      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="driver-login-right">

        <div className="driver-login-card">

          {/* HEADING */}

          <div className="driver-login-heading">

            <div className="driver-login-circle">
              🚚
            </div>

            <h1>
              Driver Login
            </h1>

            <p>
              Sign in to manage your assigned moves
            </p>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div
              className="driver-login-error"
              role="alert"
            >

              <span className="driver-error-icon">
                !
              </span>

              <span>
                {error}
              </span>

            </div>
          )}


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            className="driver-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="driver-input-group">

              <label htmlFor="driver-email">
                Email Address
              </label>

              <div className="driver-input-wrapper">

                <span
                  className="driver-input-icon"
                  aria-hidden="true"
                >
                  ✉
                </span>

                <input
                  id="driver-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="driver-input-group">

              <label htmlFor="driver-password">
                Password
              </label>

              <div className="driver-input-wrapper">

                <span
                  className="driver-input-icon"
                  aria-hidden="true"
                >
                  🔒
                </span>

                <input
                  id="driver-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="driver-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* =================================================
                HELP
            ================================================= */}

            <div className="driver-login-options">

              <span className="driver-login-security">
                🔐 Secure Driver Access
              </span>

              <button
                type="button"
                className="driver-help-button"
                onClick={handleHelp}
                disabled={loading}
              >
                Need Help?
              </button>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="driver-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="driver-button-loader"></span>

                  Signing in...
                </>
              ) : (
                <>
                  <span>→</span>

                  Sign In as Driver
                </>
              )}

            </button>

          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="driver-login-divider">
            <span>or</span>
          </div>


          {/* =================================================
              CUSTOMER LOGIN
          ================================================= */}

          <button
            type="button"
            className="driver-customer-login"
            onClick={handleCustomerLogin}
            disabled={loading}
          >
            Login as Customer
          </button>


          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div className="driver-security-note">

            <span>
              🔐
            </span>

            <p>
              Your login session is protected using
              secure JWT authentication.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DriverLogin;