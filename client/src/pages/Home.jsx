import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">
        <div className="home-container navbar-inner">

          <Link to="/" className="home-logo">
            <span className="logo-icon">M</span>
            <span>Move-Home</span>
          </Link>

          <div className="navbar-links">
            <Link to="/">Home</Link>
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#why-us">Why Move-Home?</a>
          </div>

          <div className="navbar-actions">
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="signup-btn">
              Get Started
            </Link>
          </div>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="home-container hero-grid">

          <div className="hero-content">

            <div className="hero-badge">
              🚚 Smart Digital Relocation Platform
            </div>

            <h1>
              Moving to a new place?
              <span> We make it simple.</span>
            </h1>

            <p className="hero-description">
              Move-Home is a digital relocation management platform that
              helps you plan, book and track your entire moving journey
              from one place.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">
                Start Your Move →
              </Link>

              <a href="#how-it-works" className="secondary-btn">
                See How It Works
              </a>
            </div>

            <div className="hero-trust">
              <div>
                <strong>Simple</strong>
                <span>Easy booking</span>
              </div>

              <div>
                <strong>Live</strong>
                <span>Real-time updates</span>
              </div>

              <div>
                <strong>Secure</strong>
                <span>Protected accounts</span>
              </div>
            </div>

          </div>


          {/* HERO VISUAL */}
          <div className="hero-visual">

            <div className="hero-circle"></div>

            <div className="moving-card main-moving-card">

              <div className="truck-illustration">
                🚚
              </div>

              <div className="moving-card-content">
                <span className="small-label">
                  YOUR MOVE
                </span>

                <h3>
                  Nashik → Destination
                </h3>

                <div className="status-row">
                  <span className="status-dot"></span>
                  Move Planning
                </div>
              </div>

            </div>


            <div className="floating-card floating-card-one">
              <span className="floating-icon">📦</span>

              <div>
                <strong>Easy Booking</strong>
                <small>Plan your move</small>
              </div>
            </div>


            <div className="floating-card floating-card-two">
              <span className="floating-icon">📍</span>

              <div>
                <strong>Live Tracking</strong>
                <small>Track your request</small>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= WHY MOVE HOME ================= */}
      <section id="why-us" className="why-section">
        <div className="home-container">

          <div className="section-heading">
            <span>WHY MOVE-HOME?</span>

            <h2>
              Everything you need for a
              <strong> smoother move.</strong>
            </h2>

            <p>
              Manage your relocation journey with a simple,
              transparent and connected platform.
            </p>
          </div>


          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon">📋</div>

              <h3>Easy Booking</h3>

              <p>
                Create and manage your relocation request
                through a simple digital process.
              </p>
            </div>


            <div className="feature-card featured-card">
              <div className="feature-icon">📍</div>

              <h3>Real-Time Tracking</h3>

              <p>
                Follow your moving request and receive
                live status updates during the journey.
              </p>

              <span className="feature-tag">
                LIVE FEATURE
              </span>
            </div>


            <div className="feature-card">
              <div className="feature-icon">🚛</div>

              <h3>Trusted Drivers</h3>

              <p>
                Manage drivers, vehicles and moving services
                through one connected platform.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">💰</div>

              <h3>Transparent Pricing</h3>

              <p>
                Get an estimated moving cost before
                confirming your relocation request.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">📦</div>

              <h3>Item Management</h3>

              <p>
                Add your household items and provide
                important details about your move.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon">🔐</div>

              <h3>Secure Accounts</h3>

              <p>
                Your customer information and booking
                details are protected with authentication.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section id="services" className="services-section">

        <div className="home-container">

          <div className="section-heading left-heading">
            <span>OUR SERVICES</span>

            <h2>
              One platform for your
              <strong> complete relocation.</strong>
            </h2>
          </div>


          <div className="services-grid">

            <div className="service-card">
              <div className="service-number">01</div>
              <h3>Home Relocation</h3>

              <p>
                Plan your household relocation with
                organized booking and item management.
              </p>

              <Link to="/create-move">
                Start a Move →
              </Link>
            </div>


            <div className="service-card">
              <div className="service-number">02</div>

              <h3>Vehicle Selection</h3>

              <p>
                Select a suitable vehicle based on the
                requirements of your relocation.
              </p>

              <Link to="/create-move">
                Choose Vehicle →
              </Link>
            </div>


            <div className="service-card">
              <div className="service-number">03</div>

              <h3>Move Tracking</h3>

              <p>
                Monitor your booking status and receive
                real-time updates throughout the move.
              </p>

              <Link to="/track-move">
                Track Move →
              </Link>
            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="steps-section">

        <div className="home-container">

          <div className="section-heading">

            <span>HOW IT WORKS</span>

            <h2>
              Move in just a few
              <strong> simple steps.</strong>
            </h2>

          </div>


          <div className="steps-container">

            <div className="step-item">
              <div className="step-number">1</div>

              <div>
                <h3>Create your request</h3>

                <p>
                  Enter your pickup, destination and
                  preferred moving date.
                </p>
              </div>
            </div>


            <div className="step-line"></div>


            <div className="step-item">
              <div className="step-number">2</div>

              <div>
                <h3>Add your items</h3>

                <p>
                  Tell us what you are moving and provide
                  the required item details.
                </p>
              </div>
            </div>


            <div className="step-line"></div>


            <div className="step-item">
              <div className="step-number">3</div>

              <div>
                <h3>Select a vehicle</h3>

                <p>
                  Choose a vehicle according to your
                  relocation requirements.
                </p>
              </div>
            </div>


            <div className="step-line"></div>


            <div className="step-item">
              <div className="step-number">4</div>

              <div>
                <h3>Track your move</h3>

                <p>
                  Confirm your booking and monitor
                  real-time moving status.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="home-container">

          <div className="cta-card">

            <div>
              <span className="cta-small">
                READY TO MOVE?
              </span>

              <h2>
                Start planning your
                <br />
                relocation today.
              </h2>

              <p>
                Create your Move-Home account and
                manage your entire moving journey digitally.
              </p>
            </div>

            <Link to="/register" className="cta-button">
              Get Started →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="home-container footer-grid">

          <div className="footer-brand">

            <Link to="/" className="home-logo footer-logo">
              <span className="logo-icon">M</span>
              <span>Move-Home</span>
            </Link>

            <p>
              Digital relocation management made
              simple, organized and connected.
            </p>

          </div>


          <div className="footer-column">

            <h4>Platform</h4>

            <Link to="/">Home</Link>
            <Link to="/create-move">Create Move</Link>
            <Link to="/track-move">Track Move</Link>
            <Link to="/booking-history">Bookings</Link>

          </div>


          <div className="footer-column">

            <h4>Account</h4>

            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>

          </div>


          <div className="footer-column">

            <h4>Move-Home</h4>

            <a href="#why-us">Why Us</a>
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>

          </div>

        </div>


        <div className="footer-bottom">

          <div className="home-container">

            <p>
              © 2026 Move-Home. Digital Relocation Management Platform.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;