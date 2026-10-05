import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import Sidebar from "../components/Sidebar";


/* =========================================================
   ICONS
   ========================================================= */

const TruckIcon = ({ size = 22 }) => (
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


const BackIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/* =========================================================
   VEHICLE DATA
   ========================================================= */

const vehicles = [
  {
    id: "mini-truck",
    name: "Mini Truck",
    type: "Small Move",
    capacity: "Up to 500 kg",
    suitable: "Ideal for 1 BHK / small moves",
    price: 1200,
    icon: "🚚",

    features: [
      "Up to 500 kg",
      "Small household items",
      "Best for short distance",
    ],
  },

  {
    id: "pickup",
    name: "Pickup Truck",
    type: "Medium Move",
    capacity: "Up to 1000 kg",
    suitable: "Ideal for 1–2 BHK moves",
    price: 1800,
    icon: "🚛",

    features: [
      "Up to 1000 kg",
      "Furniture & appliances",
      "Good for medium moves",
    ],
  },

  {
    id: "large-truck",
    name: "Large Truck",
    type: "Large Move",
    capacity: "Up to 2000 kg",
    suitable: "Ideal for 2–3 BHK moves",
    price: 2800,
    icon: "🚛",

    features: [
      "Up to 2000 kg",
      "Large household inventory",
      "Best for bigger moves",
    ],
  },
];


/* =========================================================
   VEHICLE SELECTION
   ========================================================= */

function VehicleSelection() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  const [moveRequest, setMoveRequest] =
    useState(null);

  const [items, setItems] = useState([]);

  const [error, setError] = useState("");


  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    const savedMoveRequest =
      localStorage.getItem("moveRequest");

    const savedItems =
      localStorage.getItem("movingItems");

    const savedVehicle =
      localStorage.getItem("selectedVehicle");


    /* -------------------------------------------------------
       AUTH CHECK
    ------------------------------------------------------- */

    if (!token) {

      navigate("/login");

      return;
    }


    /* -------------------------------------------------------
       USER
    ------------------------------------------------------- */

    if (savedUser) {

      try {

        setUser(
          JSON.parse(savedUser)
        );

      } catch {

        localStorage.removeItem("user");

      }

    }


    /* -------------------------------------------------------
       MOVE REQUEST
    ------------------------------------------------------- */

    if (savedMoveRequest) {

      try {

        setMoveRequest(
          JSON.parse(savedMoveRequest)
        );

      } catch {

        localStorage.removeItem(
          "moveRequest"
        );

      }

    }


    /* -------------------------------------------------------
       MOVING ITEMS
    ------------------------------------------------------- */

    if (savedItems) {

      try {

        setItems(
          JSON.parse(savedItems)
        );

      } catch {

        localStorage.removeItem(
          "movingItems"
        );

      }

    }


    /* -------------------------------------------------------
       SELECTED VEHICLE
    ------------------------------------------------------- */

    if (savedVehicle) {

      try {

        setSelectedVehicle(
          JSON.parse(savedVehicle)
        );

      } catch {

        localStorage.removeItem(
          "selectedVehicle"
        );

      }

    }

  }, [navigate]);


  /* =======================================================
     SELECT VEHICLE
     ======================================================= */

  const handleVehicleSelect = (vehicle) => {

    setSelectedVehicle(vehicle);

    setError("");

    localStorage.setItem(
      "selectedVehicle",
      JSON.stringify(vehicle)
    );

  };


  /* =======================================================
     CONTINUE
     ======================================================= */

  const handleContinue = () => {

    if (!selectedVehicle) {

      setError(
        "Please select a vehicle before continuing."
      );

      return;
    }


    const completeMoveRequest = {

      ...(moveRequest || {}),

      movingItems: items,

      selectedVehicle:
        selectedVehicle,

    };


    localStorage.setItem(
      "completeMoveRequest",

      JSON.stringify(
        completeMoveRequest
      )
    );


    navigate("/price-estimate");

  };


  /* =======================================================
     USER NAME
     ======================================================= */

  const firstName =
    user?.name?.split(" ")[0] ||
    "Customer";


  /* =========================================================
     UI
     ========================================================= */

  return (

    <div className="dashboard">


      {/* ==================================================
          COMMON SIDEBAR
          ONLY LOGOUT IS HERE
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

              {firstName
                .charAt(0)
                .toUpperCase()}

            </div>


            <div className="user-info">

              <div className="user-name">
                {user?.name ||
                  "Customer"}
              </div>

              <div className="user-role">
                Customer
              </div>

            </div>

            {/* NO TOP-RIGHT LOGOUT */}

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
                Choose Your Vehicle
              </h1>


              <p className="page-description">

                Select a vehicle that fits your moving
                requirements. You can review the estimated
                price before confirming your booking.

              </p>

            </div>


            <button
              className="back-dashboard-btn"
              onClick={() =>
                navigate("/moving-items")
              }
            >

              <BackIcon size={16} />

              Moving Items

            </button>

          </div>


          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="move-progress-card">


            {/* STEP 1 */}

            <div className="move-step completed">

              <div className="step-number completed-number">
                ✓
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


            <div className="step-line completed-line"></div>


            {/* STEP 2 */}

            <div className="move-step completed">

              <div className="step-number completed-number">
                ✓
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


            <div className="step-line completed-line"></div>


            {/* STEP 3 */}

            <div className="move-step active">

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
              VEHICLE CARD
          ================================================== */}

          <div className="move-form-card">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="move-form-header">

              <div className="form-header-icon">

                <TruckIcon size={25} />

              </div>


              <div>

                <h2>
                  Available Vehicles
                </h2>


                <p>

                  Choose the vehicle that best matches
                  the size of your move.

                </p>

              </div>

            </div>


            {/* ==================================================
                VEHICLE GRID
            ================================================== */}

            <div className="vehicle-selection-grid">

              {vehicles.map((vehicle) => {

                const isSelected =
                  selectedVehicle?.id ===
                  vehicle.id;


                return (

                  <button
                    key={vehicle.id}
                    type="button"
                    className={`vehicle-card ${
                      isSelected
                        ? "vehicle-card-selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleVehicleSelect(
                        vehicle
                      )
                    }
                  >


                    {/* CHECK */}

                    <div
                      className={`vehicle-check ${
                        isSelected
                          ? "vehicle-check-selected"
                          : ""
                      }`}
                    >

                      {isSelected
                        ? "✓"
                        : ""}

                    </div>


                    {/* ICON */}

                    <div className="vehicle-icon">

                      {vehicle.icon}

                    </div>


                    {/* NAME */}

                    <div className="vehicle-name">

                      {vehicle.name}

                    </div>


                    <div className="vehicle-type">

                      {vehicle.type}

                    </div>


                    {/* CAPACITY */}

                    <div className="vehicle-capacity">

                      {vehicle.capacity}

                    </div>


                    {/* SUITABLE */}

                    <p className="vehicle-suitable">

                      {vehicle.suitable}

                    </p>


                    {/* FEATURES */}

                    <div className="vehicle-features">

                      {vehicle.features.map(
                        (feature, index) => (

                          <div
                            key={index}
                            className="vehicle-feature"
                          >

                            <span>
                              ✓
                            </span>

                            {feature}

                          </div>

                        )
                      )}

                    </div>


                    {/* PRICE */}

                    <div className="vehicle-price">

                      <span>
                        Starting from
                      </span>


                      <strong>

                        ₹
                        {vehicle.price.toLocaleString(
                          "en-IN"
                        )}

                      </strong>


                      <small>
                        estimated base fare
                      </small>

                    </div>


                    {/* SELECT */}

                    <div
                      className={`vehicle-select-label ${
                        isSelected
                          ? "vehicle-select-label-selected"
                          : ""
                      }`}
                    >

                      {isSelected
                        ? "Selected"
                        : "Select Vehicle"}

                    </div>

                  </button>

                );

              })}

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div className="form-error vehicle-error">

                <span>
                  ⚠
                </span>

                <div>
                  {error}
                </div>

              </div>

            )}


            {/* ==================================================
                SELECTED SUMMARY
            ================================================== */}

            {selectedVehicle && (

              <div className="selected-vehicle-summary">


                <div className="selected-summary-icon">

                  {selectedVehicle.icon}

                </div>


                <div>

                  <span>
                    Selected Vehicle
                  </span>


                  <strong>
                    {selectedVehicle.name}
                  </strong>

                </div>


                <div className="selected-summary-price">

                  <span>
                    Base fare
                  </span>


                  <strong>

                    ₹
                    {selectedVehicle.price.toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>

              </div>

            )}


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="move-form-footer">


              <div className="form-footer-info">

                <div className="info-icon">
                  💡
                </div>


                <div>

                  <strong>
                    Vehicle recommendation
                  </strong>


                  <p>

                    Choose a vehicle based on your item
                    quantity and household size. The final
                    estimate will be calculated in the next step.

                  </p>

                </div>

              </div>


              <div className="form-actions">


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    navigate("/moving-items")
                  }
                >

                  <BackIcon size={16} />

                  Back

                </button>


                <button
                  type="button"
                  className="continue-btn"
                  onClick={handleContinue}
                >

                  Continue

                  <ArrowIcon size={17} />

                </button>

              </div>

            </div>

          </div>


          {/* ==================================================
              HELP CARD
          ================================================== */}

          <div className="page-help-card">

            <div className="help-icon">
              ✓
            </div>


            <div>

              <strong>
                One more step!
              </strong>


              <p>

                After selecting your vehicle, you'll see
                a complete estimated relocation cost.

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


export default VehicleSelection;