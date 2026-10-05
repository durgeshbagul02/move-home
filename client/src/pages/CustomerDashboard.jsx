import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

/* ================= ICONS ================= */

const HomeIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 10.5L12 3l9 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 9.5V21h13V9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 21v-6h5v6"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const PlusIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 8v8M8 12h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TruckIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h11v11H3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 10h4l3 3v4h-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="19"
      r="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="18"
      cy="19"
      r="2"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const FileIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 3h8l4 4v14H6z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v5h4M9 13h6M9 17h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="8"
      r="3.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M5 21c.8-4 3.1-6 7-6s6.2 2 7 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MailIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 7l8 6 8-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7 3h3l1.5 4-2 1.5c1 2.1 2.7 3.8 4.8 4.8l1.5-2 4 1.5v3c0 1-1 2-2 2C11.7 17.8 6.2 12.3 5.2 6c-.2-1.5.3-3 1.8-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7 10l5 5 5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PackageIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M4 7.5l8 4.5 8-4.5M12 12v9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const ZapIcon = ({ size = 21 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M13 2L4 14h7l-1 8 9-12h-7z"
      fill="currentColor"
    />
  </svg>
);

/* ================= DASHBOARD ================= */

function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [bookings, setBookings] = useState([]);

  const [loadingBookings, setLoadingBookings] = useState(true);

  const [bookingError, setBookingError] = useState("");

  /* ==================================================
     LOAD USER
     ================================================== */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User data error:", error);
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  /* ==================================================
     LOAD BOOKINGS FROM MONGODB
     ================================================== */

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        setLoadingBookings(true);
        setBookingError("");

        const response = await API.get(
          "/bookings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const fetchedBookings =
            response.data.bookings || [];

          setBookings(fetchedBookings);

        } else {
          setBookingError(
            response.data.message ||
              "Unable to load bookings."
          );
        }

      } catch (error) {
        console.error(
          "Customer bookings error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Unable to load your bookings.";

        setBookingError(message);

      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();

  }, [navigate]);

  /* ==================================================
     ACTIVE BOOKING
     
     Backend returns bookings sorted by createdAt DESC,
     so the first non-delivered/non-cancelled booking
     is the latest active booking.
     ================================================== */

  const activeBooking =
    bookings.find(
      (booking) =>
        booking.status !== "DELIVERED" &&
        booking.status !== "CANCELLED"
    ) || null;

  /* ==================================================
     SYNC ACTIVE BOOKING WITH TRACK MY MOVE
     
     This keeps the latest MongoDB booking available
     for TrackMyMove.
     ================================================== */

  useEffect(() => {
    if (activeBooking) {
      localStorage.setItem(
        "currentBooking",
        JSON.stringify(activeBooking)
      );
    }
  }, [activeBooking]);

  /* ==================================================
     STATUS DISPLAY
     ================================================== */

  const getStatusText = (status) => {
    switch (status) {
      case "BOOKING_CONFIRMED":
        return "Booking Confirmed";

      case "DRIVER_ASSIGNED":
        return "Driver Assigned";

      case "PICKUP_SCHEDULED":
        return "Pickup Scheduled";

      case "ITEMS_LOADING":
        return "Items Being Loaded";

      case "ITEMS_LOADED":
        return "Items Loaded";

      case "ON_THE_WAY":
        return "Move On The Way";

      case "ARRIVED":
        return "Driver Arrived";

      case "DELIVERED":
        return "Delivered";

      case "CANCELLED":
        return "Cancelled";

      default:
        return "Booking Confirmed";
    }
  };

  /* ==================================================
     USER DISPLAY
     ================================================== */

  const firstName =
    user?.name?.split(" ")[0] ||
    "Customer";

  return (
    <div className="dashboard">

      {/* ==================================================
          COMMON SIDEBAR
          ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN AREA
          ================================================== */}

      <div className="main-area">

        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="topbar">

          <div className="mobile-brand">
            Move-Home
          </div>

          <div className="topbar-right">

            <div className="user-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div className="user-info">

              <div className="user-name">
                {user?.name || "Customer"}
              </div>

              <div className="user-role">
                Customer
              </div>

            </div>

            <ChevronIcon />

          </div>

        </header>

        {/* ==================================================
            CONTENT
            ================================================== */}

        <main className="content">

          {/* ==================================================
              WELCOME CARD
              ================================================== */}

          <section className="welcome-card">

            <div className="welcome-content">

              <div className="welcome-label">
                GOOD MORNING,
              </div>

              <h1>
                Welcome back, {firstName}{" "}
                <span>👋</span>
              </h1>

              <p>
                Manage your relocation journey
                from one place.
              </p>

            </div>

            {/* ==================================================
                WELCOME ILLUSTRATION
                ================================================== */}

            <div className="welcome-illustration">

              <div className="welcome-cloud cloud-a"></div>

              <div className="welcome-cloud cloud-b"></div>

              <div className="welcome-house">

                <div className="welcome-roof"></div>

                <div className="welcome-house-body">

                  <div className="window window-left"></div>

                  <div className="window window-right"></div>

                  <div className="door"></div>

                </div>

              </div>

              <div className="welcome-truck">

                <div className="welcome-truck-body">

                  <PackageIcon size={25} />

                </div>

                <div className="welcome-cabin"></div>

                <div className="welcome-wheel wheel-a"></div>

                <div className="welcome-wheel wheel-b"></div>

              </div>

              <div className="box box-one"></div>

              <div className="box box-two"></div>

            </div>

          </section>

          {/* ==================================================
              QUICK ACTION TITLE
              ================================================== */}

          <div className="section-heading">

            <div className="heading-left">

              <div className="heading-icon">
                <ZapIcon size={19} />
              </div>

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Manage your relocation quickly
                </p>

              </div>

            </div>

            <button
              className="view-all"
              onClick={() =>
                navigate("/booking-history")
              }
            >
              View All

              <ArrowIcon size={16} />

            </button>

          </div>

          {/* ==================================================
              ACTION CARDS
              ================================================== */}

          <section className="action-grid">

            {/* ==================================================
                CREATE REQUEST
                ================================================== */}

            <div className="action-card blue-card">

              <div className="action-top">

                <div className="action-icon blue-icon">
                  <PackageIcon size={27} />
                </div>

                <div className="round-arrow">
                  <ArrowIcon size={17} />
                </div>

              </div>

              <h3>
                Create Moving Request
              </h3>

              <p>
                Plan your relocation, add your
                items and get an estimated price.
              </p>

              <button
                className="action-button blue-button"
                onClick={() =>
                  navigate("/create-move")
                }
              >
                Create Request

                <ArrowIcon size={17} />

              </button>

            </div>

            {/* ==================================================
                TRACK MY MOVE
                ================================================== */}

            <div className="action-card green-card">

              <div className="action-top">

                <div className="action-icon green-icon">
                  <TruckIcon size={27} />
                </div>

                <div className="round-arrow green-arrow">
                  <ArrowIcon size={17} />
                </div>

              </div>

              <h3>
                Track My Move
              </h3>

              <p>
                Monitor your current relocation
                and receive live status updates.
              </p>

              <button
                className="action-button green-button"
                onClick={() =>
                  navigate("/track-move")
                }
              >
                Track Move

                <ArrowIcon size={17} />

              </button>

            </div>

            {/* ==================================================
                BOOKING HISTORY
                ================================================== */}

            <div className="action-card purple-card">

              <div className="action-top">

                <div className="action-icon purple-icon">
                  <FileIcon size={27} />
                </div>

                <div className="round-arrow purple-arrow">
                  <ArrowIcon size={17} />
                </div>

              </div>

              <h3>
                Booking History
              </h3>

              <p>
                View your previous and current
                relocation bookings.
              </p>

              <button
                className="action-button purple-button"
                onClick={() =>
                  navigate("/booking-history")
                }
              >
                View History

                <ArrowIcon size={17} />

              </button>

            </div>

          </section>

          {/* ==================================================
              BOTTOM GRID
              ================================================== */}

          <section className="bottom-grid">

            {/* ==================================================
                ACCOUNT INFORMATION
                ================================================== */}

            <div className="account-card">

              <div className="card-header">

                <div className="header-icon">
                  <UserIcon size={20} />
                </div>

                <div>

                  <h3>
                    Account Information
                  </h3>

                  <p>
                    Your registered account details
                  </p>

                </div>

              </div>

              <div className="account-details">

                {/* FULL NAME */}

                <div className="detail-item">

                  <div className="detail-icon blue-detail">
                    <UserIcon size={18} />
                  </div>

                  <div>

                    <span>
                      Full Name
                    </span>

                    <strong>
                      {user?.name || "-"}
                    </strong>

                  </div>

                </div>

                {/* EMAIL */}

                <div className="detail-item">

                  <div className="detail-icon purple-detail">
                    <MailIcon size={18} />
                  </div>

                  <div>

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {user?.email || "-"}
                    </strong>

                  </div>

                </div>

                {/* PHONE */}

                <div className="detail-item">

                  <div className="detail-icon green-detail">
                    <PhoneIcon size={18} />
                  </div>

                  <div>

                    <span>
                      Phone Number
                    </span>

                    <strong>
                      {user?.phone || "-"}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                RELOCATION STATUS
                ================================================== */}

            <div className="status-card">

              <div className="status-decoration"></div>

              <div className="status-content">

                <div className="status-header">

                  <div className="status-icon">
                    <TruckIcon size={20} />
                  </div>

                  <div>

                    <h3>
                      Relocation Status
                    </h3>

                    <p>
                      Your current move
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    LOADING
                    ================================================== */}

                {loadingBookings ? (

                  <>

                    <div className="status-title">

                      <span className="status-dot"></span>

                      Loading booking...

                    </div>

                    <p className="status-description">

                      Fetching your latest
                      relocation details.

                    </p>

                  </>

                ) : bookingError ? (

                  /* ==================================================
                     ERROR
                     ================================================== */

                  <>

                    <div className="status-title">

                      <span className="status-dot"></span>

                      Unable to load booking

                    </div>

                    <p className="status-description">

                      {bookingError}

                    </p>

                    <button
                      className="start-button"
                      onClick={() =>
                        window.location.reload()
                      }
                    >
                      Retry

                      <ArrowIcon size={17} />

                    </button>

                  </>

                ) : activeBooking ? (

                  /* ==================================================
                     ACTIVE BOOKING
                     ================================================== */

                  <>

                    <div className="status-title">

                      <span className="status-dot"></span>

                      {getStatusText(
                        activeBooking.status
                      )}

                    </div>

                    <p className="status-description">

                      <strong>
                        Booking:
                      </strong>{" "}

                      {activeBooking.bookingId}

                      <br />

                      {activeBooking.moveRequest
                        ?.pickupAddress ||
                        "Pickup location"}

                      {" → "}

                      {activeBooking.moveRequest
                        ?.destinationAddress ||
                        "Destination"}

                      {/* DRIVER */}

                      {activeBooking.driver && (
                        <>

                          <br />

                          <strong>
                            Driver:
                          </strong>{" "}

                          {activeBooking.driver.name}

                        </>
                      )}

                      {/* VEHICLE */}

                      {activeBooking.selectedVehicle && (
                        <>

                          <br />

                          <strong>
                            Vehicle:
                          </strong>{" "}

                          {activeBooking
                            .selectedVehicle
                            .name ||
                            "Vehicle Assigned"}

                        </>
                      )}

                    </p>

                    <button
                      className="start-button"
                      onClick={() =>
                        navigate("/track-move")
                      }
                    >
                      Track My Move

                      <ArrowIcon size={17} />

                    </button>

                  </>

                ) : (

                  /* ==================================================
                     NO ACTIVE BOOKING
                     ================================================== */

                  <>

                    <div className="status-title">

                      <span className="status-dot"></span>

                      No active moving request

                    </div>

                    <p className="status-description">

                      Create a moving request
                      to start your relocation journey.

                    </p>

                    <button
                      className="start-button"
                      onClick={() =>
                        navigate("/create-move")
                      }
                    >
                      Start Moving

                      <ArrowIcon size={17} />

                    </button>

                  </>

                )}

              </div>

              <div className="status-background-icon">

                <PackageIcon size={90} />

              </div>

            </div>

          </section>

          {/* ==================================================
              FOOTER
              ================================================== */}

          <footer className="footer">

            © 2026 Move-Home · Digital Relocation
            Management System.

          </footer>

        </main>

      </div>

    </div>
  );
}

export default CustomerDashboard;