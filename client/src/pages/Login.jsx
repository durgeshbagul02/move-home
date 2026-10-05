import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/login", formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= TOP BAR ================= */}

      <header className="login-topbar">

        <button
          className="login-brand"
          onClick={() => navigate("/")}
        >
          <div className="login-brand-icon">
            🏠
          </div>

          <div className="login-brand-text">
            <span className="login-brand-name">
              Move-Home
            </span>

            <span className="login-brand-subtitle">
              Digital Relocation Management
            </span>
          </div>
        </button>

        <button
          className="login-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="login-main">

        <div className="login-container">


          {/* ================= LEFT CONTENT ================= */}

          <section className="login-intro">

            <div className="login-badge">
              🚚 WELCOME BACK
            </div>

            <h1>
              Move smarter.
              <span>Move simpler.</span>
            </h1>

            <p className="login-description">
              Sign in to continue managing your relocation,
              track your moving request and stay updated
              throughout your journey.
            </p>


            {/* Relocation Visual */}

            <div className="login-visual">

              <div className="login-visual-circle"></div>

              <div className="login-home-card">
                🏠
              </div>

              <div className="login-route-line">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="login-truck-card">
                🚚
              </div>

              <div className="login-destination-card">
                🏢
              </div>

            </div>


            {/* Features */}

            <div className="login-features">

              <div className="login-feature">

                <div className="login-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Manage Your Move</strong>
                  <span>
                    Access your relocation requests
                  </span>
                </div>

              </div>


              <div className="login-feature">

                <div className="login-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Real-Time Tracking</strong>
                  <span>
                    Follow your moving progress
                  </span>
                </div>

              </div>


              <div className="login-feature">

                <div className="login-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>Stay Connected</strong>
                  <span>
                    Get updates throughout your move
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* ================= LOGIN CARD ================= */}

          <section className="login-card">

            <div className="login-card-header">

              <div className="login-form-label">
                ACCOUNT LOGIN
              </div>

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to access your Move-Home dashboard.
              </p>

            </div>


            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* EMAIL */}

              <div className="login-form-group">

                <label htmlFor="login-email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    ✉
                  </span>

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="login-form-group">

                <label htmlFor="login-password">
                  Password
                  <span>*</span>
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    🔒
                  </span>

                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="login-error">

                  <span>!</span>

                  <p>
                    {error}
                  </p>

                </div>
              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >

                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <span>→</span>
                  </>
                )}

              </button>

            </form>


            {/* REGISTER */}

            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <button
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>

            </div>


            {/* SECURITY */}

            <div className="login-security">

              <span>🔐</span>

              <div>

                <strong>
                  Secure Account Access
                </strong>

                <p>
                  Your login credentials are protected
                  using secure authentication.
                </p>

              </div>

            </div>

          </section>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="login-footer">

        <p>
          © 2026 Move-Home · Digital Relocation Management Platform
        </p>

      </footer>

    </div>
  );
}

export default Login;