import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ===================================================
    // PHONE NUMBER
    // ===================================================

    if (name === "phone") {
      // Remove everything except numbers
      const phoneNumber = value.replace(/\D/g, "");

      // Allow maximum 10 digits
      if (phoneNumber.length <= 10) {
        setFormData({
          ...formData,
          phone: phoneNumber,
        });
      }

      setError("");
      setSuccess("");

      return;
    }

    // ===================================================
    // OTHER FIELDS
    // ===================================================

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  // =====================================================
  // HANDLE FORM SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    // =====================================================
    // 1. REQUIRED FIELD VALIDATION
    // =====================================================

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill all the required fields."
      );
      return;
    }

    // =====================================================
    // 2. PHONE NUMBER VALIDATION
    // =====================================================

    if (!/^[0-9]{10}$/.test(phone)) {
      setError(
        "Phone number must be exactly 10 digits."
      );
      return;
    }

    // =====================================================
    // 3. PASSWORD LENGTH VALIDATION
    // =====================================================

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // =====================================================
    // 4. CONFIRM PASSWORD VALIDATION
    // =====================================================

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =====================================================
    // 5. SEND DATA TO BACKEND
    // =====================================================

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await API.post(
        "/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password,
        }
      );

      // ===================================================
      // REGISTRATION SUCCESS
      // ===================================================

      if (response.data.success) {
        setSuccess(
          "Registration successful! Redirecting to login..."
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* ================= TOP BAR ================= */}

      <header className="register-topbar">

        <button
          className="register-brand"
          onClick={() => navigate("/")}
        >
          <div className="register-brand-icon">
            🏠
          </div>

          <div className="register-brand-text">
            <span className="register-brand-name">
              Move-Home
            </span>

            <span className="register-brand-subtitle">
              Digital Relocation Management
            </span>
          </div>
        </button>

        <button
          className="topbar-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="register-main">

        <div className="register-container">


          {/* ================= LEFT SIDE ================= */}

          <section className="register-intro">

            <div className="intro-badge">
              🚚 START YOUR JOURNEY
            </div>

            <h1>
              Your next move
              <span> starts here.</span>
            </h1>

            <p className="intro-description">
              Create your Move-Home account and manage
              your entire relocation journey from one
              simple platform.
            </p>


            {/* Illustration */}

            <div className="relocation-illustration">

              <div className="illustration-circle"></div>

              <div className="illustration-house">
                🏠
              </div>

              <div className="illustration-arrow">
                →
              </div>

              <div className="illustration-truck">
                🚚
              </div>

              <div className="illustration-destination">
                🏢
              </div>

            </div>


            {/* Benefits */}

            <div className="intro-benefits">

              <div className="benefit-item">

                <div className="benefit-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Simple Planning
                  </strong>

                  <span>
                    Organize your relocation easily
                  </span>
                </div>

              </div>


              <div className="benefit-item">

                <div className="benefit-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Real-Time Updates
                  </strong>

                  <span>
                    Stay informed about your move
                  </span>
                </div>

              </div>


              <div className="benefit-item">

                <div className="benefit-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    One Connected Platform
                  </strong>

                  <span>
                    Manage everything in one place
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* ================= REGISTER CARD ================= */}

          <section className="register-card">

            <div className="register-card-header">

              <div className="form-label">
                CREATE ACCOUNT
              </div>

              <h2>
                Get started
              </h2>

              <p>
                Enter your details to create your
                Move-Home account.
              </p>

            </div>


            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="name">
                  Full Name
                  <span>*</span>
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    👤
                  </span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="phone">
                  Phone Number
                  <span>*</span>
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    📱
                  </span>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    maxLength={10}
                    inputMode="numeric"
                  />

                </div>

                <p
                  style={{
                    marginTop: "6px",
                    marginBottom: "0",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  Enter valid phone number.
                </p>

              </div>


              {/* PASSWORD ROW */}

              <div className="password-row">

                <div className="form-group">

                  <label htmlFor="password">
                    Password
                    <span>*</span>
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      🔒
                    </span>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      autoComplete="new-password"
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label htmlFor="confirmPassword">
                    Confirm Password
                    <span>*</span>
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      🔐
                    </span>

                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />

                  </div>

                </div>

              </div>


              <p className="password-hint">
                Password must contain at least 6 characters.
              </p>


              {/* ERROR */}

              {error && (
                <div className="form-message error-message">

                  <span>!</span>

                  <p>
                    {error}
                  </p>

                </div>
              )}


              {/* SUCCESS */}

              {success && (
                <div className="form-message success-message">

                  <span>✓</span>

                  <p>
                    {success}
                  </p>

                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="register-submit"
              >

                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span>→</span>
                  </>
                )}

              </button>

            </form>


            {/* LOGIN */}

            <div className="login-section">

              <span>
                Already have an account?
              </span>

              <button
                onClick={() => navigate("/login")}
              >
                Login
              </button>

            </div>


            {/* SECURITY */}

            <div className="security-note">

              <span>🔐</span>

              <div>
                <strong>
                  Your information is secure
                </strong>

                <p>
                  Your account details are protected
                  using secure authentication.
                </p>
              </div>

            </div>

          </section>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="register-footer">

        <p>
          © 2026 Move-Home · Digital Relocation Management Platform
        </p>

      </footer>

    </div>
  );
}

export default Register;