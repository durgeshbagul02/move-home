import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CustomerDashboard.css";
import Sidebar from "../components/Sidebar";

/* =========================================================
   ICONS
   ========================================================= */

const HomeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 22v-7h6v7"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const PlusIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TruckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h11v11H3V6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 10h4l3 3v4h-7v-7Z"
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

const FileIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 3h9l4 4v14H6V3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v5h5M9 13h6M9 17h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LogoutIcon = ({ size = 19 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 8l4 4-4 4M18 12H9"
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

const MapPinIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="10"
      r="2.5"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const CalendarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 3v4M8 3v4M3 10h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BuildingIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 21V4h10v17M14 9h6v12M8 8h2M8 12h2M8 16h2M17 13h1M17 17h1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/* =========================================================
   CREATE REQUEST
   ========================================================= */

function CreateRequest() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    pickupAddress: "",
    destinationAddress: "",
    movingDate: "",
    propertyType: "",
  });

  const [error, setError] = useState("");


  /* =========================================================
     AUTH
     ========================================================= */

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
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);


  /* =========================================================
     FORM
     ========================================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };


  const handleNext = (e) => {
    e.preventDefault();

    const pickup = formData.pickupAddress.trim();
    const destination = formData.destinationAddress.trim();

    if (
      !pickup ||
      !destination ||
      !formData.movingDate ||
      !formData.propertyType
    ) {
      setError("Please fill all the required fields.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formData.movingDate < today) {
      setError("Moving date cannot be in the past.");
      return;
    }

    const cleanedData = {
      ...formData,
      pickupAddress: pickup,
      destinationAddress: destination,
    };

    localStorage.setItem(
      "moveRequest",
      JSON.stringify(cleanedData)
    );

    /* Start a fresh moving request */
    localStorage.removeItem("movingItems");
    localStorage.removeItem("completeMoveRequest");

    navigate("/moving-items");
  };


  const firstName =
    user?.name?.split(" ")[0] || "Customer";

  const today = new Date().toISOString().split("T")[0];


  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="dashboard">

      {/* ==================================================
          COMMON SIDEBAR
          Only sidebar Logout will be shown
      ================================================== */}

      <Sidebar />


      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="main-area">


        {/* ==================================================
            TOPBAR
        ================================================== */}

        <header className="topbar">

          <div className="mobile-brand">
            Move-Home
          </div>


          <div className="topbar-right">

            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>


            <div className="user-info">

              <div className="user-name">
                {user?.name || "Customer"}
              </div>

              <div className="user-role">
                Customer
              </div>

            </div>

            {/* NO LOGOUT HERE */}

          </div>

        </header>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="content">


          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <div className="content-header">

            <div>

              <div className="page-eyebrow">
                MOVING REQUEST
              </div>

              <h1 className="page-title">
                Plan Your Move
              </h1>

              <p className="page-description">
                Tell us where and when you are moving.
                We'll help you plan the rest.
              </p>

            </div>


            <button
              className="back-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>

          </div>


          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="move-progress-card">


            {/* STEP 1 */}

            <div className="move-step active">

              <div className="step-number">
                1
              </div>

              <div>

                <strong>
                  Move Details
                </strong>

                <span>
                  Location & date
                </span>

              </div>

            </div>


            <div className="step-line active-line"></div>


            {/* STEP 2 */}

            <div className="move-step">

              <div className="step-number">
                2
              </div>

              <div>

                <strong>
                  Items
                </strong>

                <span>
                  Inventory
                </span>

              </div>

            </div>


            <div className="step-line"></div>


            {/* STEP 3 */}

            <div className="move-step">

              <div className="step-number">
                3
              </div>

              <div>

                <strong>
                  Vehicle
                </strong>

                <span>
                  Select vehicle
                </span>

              </div>

            </div>


            <div className="step-line"></div>


            {/* STEP 4 */}

            <div className="move-step">

              <div className="step-number">
                4
              </div>

              <div>

                <strong>
                  Confirm
                </strong>

                <span>
                  Review booking
                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              FORM CARD
          ================================================== */}

          <form
            onSubmit={handleNext}
            className="move-form-card"
          >


            {/* ==================================================
                FORM HEADER
            ================================================== */}

            <div className="move-form-header">

              <div className="form-header-icon">
                <MapPinIcon size={25} />
              </div>


              <div>

                <h2>
                  Location & Move Details
                </h2>

                <p>
                  Enter the pickup and destination
                  information for your relocation.
                </p>

              </div>

            </div>


            {/* ==================================================
                FORM BODY
            ================================================== */}

            <div className="move-form-body">


              {/* ==================================================
                  LOCATION GRID
              ================================================== */}

              <div className="location-grid">


                {/* ==================================================
                    PICKUP
                ================================================== */}

                <div className="location-card">

                  <div className="field-top">

                    <div className="field-icon pickup-icon">
                      <MapPinIcon size={20} />
                    </div>


                    <div>

                      <label>
                        Pickup Address
                        <span>*</span>
                      </label>

                      <p>
                        Where should we collect your items?
                      </p>

                    </div>

                  </div>


                  <textarea
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your current address..."
                  />


                  <small>
                    Include house/flat number, building name,
                    street and area.
                  </small>

                </div>


                {/* ==================================================
                    DESTINATION
                ================================================== */}

                <div className="location-card">

                  <div className="field-top">

                    <div className="field-icon destination-icon">
                      <MapPinIcon size={20} />
                    </div>


                    <div>

                      <label>
                        Destination Address
                        <span>*</span>
                      </label>

                      <p>
                        Where should we deliver your items?
                      </p>

                    </div>

                  </div>


                  <textarea
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your new address..."
                  />


                  <small>
                    Include house/flat number, building name,
                    street and area.
                  </small>

                </div>

              </div>


              {/* ==================================================
                  DATE + PROPERTY
              ================================================== */}

              <div className="details-grid">


                {/* ==================================================
                    DATE
                ================================================== */}

                <div className="form-field">

                  <label>
                    Moving Date
                    <span>*</span>
                  </label>


                  <div className="input-with-icon">

                    <CalendarIcon size={19} />

                    <input
                      type="date"
                      name="movingDate"
                      value={formData.movingDate}
                      onChange={handleChange}
                      min={today}
                    />

                  </div>


                  <small>
                    Select your preferred moving date.
                  </small>

                </div>


                {/* ==================================================
                    PROPERTY
                ================================================== */}

                <div className="form-field">

                  <label>
                    Property Type
                    <span>*</span>
                  </label>


                  <div className="input-with-icon">

                    <BuildingIcon size={19} />

                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select property type
                      </option>

                      <option value="1bhk">
                        1 BHK
                      </option>

                      <option value="2bhk">
                        2 BHK
                      </option>

                      <option value="3bhk">
                        3 BHK
                      </option>

                      <option value="4bhk">
                        4 BHK
                      </option>

                      <option value="office">
                        Office
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>


                  <small>
                    This helps us estimate the required vehicle.
                  </small>

                </div>

              </div>


              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="form-error">

                  <span>
                    ⚠
                  </span>

                  <div>
                    {error}
                  </div>

                </div>

              )}

            </div>


            {/* ==================================================
                FORM FOOTER
            ================================================== */}

            <div className="move-form-footer">


              <div className="form-footer-info">

                <div className="info-icon">
                  💡
                </div>


                <div>

                  <strong>
                    No price calculation yet
                  </strong>

                  <p>
                    We'll calculate an estimated relocation
                    cost after you add your items and select
                    a vehicle.
                  </p>

                </div>

              </div>


              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="continue-btn"
                >
                  Continue
                  <ArrowIcon size={18} />
                </button>

              </div>

            </div>

          </form>


          {/* ==================================================
              BOTTOM INFO
          ================================================== */}

          <div className="page-help-card">

            <div className="help-icon">
              ✓
            </div>


            <div>

              <strong>
                Your information is safe with us
              </strong>

              <p>
                Your moving details will be used only to
                prepare your relocation request and calculate
                the best service option for you.
              </p>

            </div>

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="footer">
            © 2026 Move-Home · Digital Relocation Management
          </div>


        </main>

      </div>

    </div>
  );
}

export default CreateRequest;