import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "./BookingConfirmation.css";
import Sidebar from "../components/Sidebar";

const BookingConfirmation = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [moveRequest, setMoveRequest] = useState(null);
  const [movingItems, setMovingItems] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [user, setUser] = useState(null);

  // ==========================================
  // LOAD DATA FROM LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    // ------------------------------------------
    // GET LOGGED-IN USER
    // ------------------------------------------

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("User data error:", error);
      }
    }

    // ------------------------------------------
    // GET MOVE REQUEST
    // ------------------------------------------

    const savedMoveRequest =
      localStorage.getItem("moveRequest");

    if (savedMoveRequest) {
      try {
        const parsedMoveRequest =
          JSON.parse(savedMoveRequest);

        console.log(
          "Move Request loaded:",
          parsedMoveRequest
        );

        setMoveRequest(parsedMoveRequest);
      } catch (error) {
        console.error(
          "Move request error:",
          error
        );
      }
    }

    // ------------------------------------------
    // GET MOVING ITEMS
    // ------------------------------------------

    const savedItems =
      localStorage.getItem("movingItems");

    if (savedItems) {
      try {
        const parsedItems =
          JSON.parse(savedItems);

        setMovingItems(
          Array.isArray(parsedItems)
            ? parsedItems
            : []
        );
      } catch (error) {
        console.error(
          "Moving items error:",
          error
        );
      }
    }

    // ------------------------------------------
    // GET SELECTED VEHICLE
    // ------------------------------------------

    const savedVehicle =
      localStorage.getItem(
        "selectedVehicle"
      );

    if (savedVehicle) {
      try {
        const parsedVehicle =
          JSON.parse(savedVehicle);

        setSelectedVehicle(
          parsedVehicle
        );
      } catch (error) {
        console.error(
          "Vehicle error:",
          error
        );
      }
    }

    // ------------------------------------------
    // GET PRICE ESTIMATE
    // ------------------------------------------

    const savedPrice =
      localStorage.getItem(
        "priceEstimate"
      );

    if (savedPrice) {
      try {
        const parsedPrice =
          JSON.parse(savedPrice);

        setPriceEstimate(
          parsedPrice
        );
      } catch (error) {
        console.error(
          "Price estimate error:",
          error
        );
      }
    }
  }, []);

  // ==========================================
  // HELPERS
  // ==========================================

  const formatPropertyType = (value) => {
    if (!value) {
      return "Not provided";
    }

    const text = String(value).trim();

    const lowerText =
      text.toLowerCase();

    if (lowerText === "1bhk") {
      return "1 BHK";
    }

    if (lowerText === "2bhk") {
      return "2 BHK";
    }

    if (lowerText === "3bhk") {
      return "3 BHK";
    }

    if (lowerText === "4bhk") {
      return "4 BHK";
    }

    if (lowerText === "office") {
      return "Office";
    }

    if (lowerText === "other") {
      return "Other";
    }

    return text;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not provided";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // ITEM QUANTITY
  // ==========================================

  const getItemQuantity = () => {
    return movingItems.reduce(
      (total, item) => {
        return (
          total +
          Number(
            item.quantity || 0
          )
        );
      },
      0
    );
  };

  // ==========================================
  // FRAGILE QUANTITY
  // ==========================================

  const getFragileQuantity = () => {
    return movingItems.reduce(
      (total, item) => {
        const isFragile =
          item.fragile === true ||
          item.isFragile === true ||
          item.fragile === "true";

        return (
          total +
          (
            isFragile
              ? Number(
                  item.quantity || 0
                )
              : 0
          )
        );
      },
      0
    );
  };

  // ==========================================
  // LOCATION DATA
  //
  // CreateRequest stores:
  // pickupAddress
  // destinationAddress
  // ==========================================

  const pickupLocation =
    moveRequest?.pickupAddress ||
    "Not provided";

  const destination =
    moveRequest?.destinationAddress ||
    "Not provided";

  // ==========================================
  // PRICE DATA
  // ==========================================

  const distanceCharge = Number(
    priceEstimate?.distanceCharge ??
      priceEstimate?.distancePrice ??
      450
  );

  const vehicleCharge = Number(
    priceEstimate?.vehicleCharge ??
      priceEstimate?.vehiclePrice ??
      selectedVehicle?.price ??
      0
  );

  const itemHandling = Number(
    priceEstimate?.itemHandling ??
      priceEstimate?.itemHandlingCharge ??
      0
  );

  const fragileHandling = Number(
    priceEstimate?.fragileHandling ??
      priceEstimate?.fragileCharge ??
      0
  );

  const serviceCharge = Number(
    priceEstimate?.serviceCharge ??
      priceEstimate?.additionalCharges ??
      0
  );

  const calculatedTotal =
    distanceCharge +
    vehicleCharge +
    itemHandling +
    fragileHandling +
    serviceCharge;

  const finalTotal = Number(
    priceEstimate?.total ??
      priceEstimate?.totalEstimate ??
      priceEstimate?.estimatedTotal ??
      calculatedTotal
  );

  // ==========================================
  // CONFIRM BOOKING
  // ==========================================

  const handleConfirmBooking = async () => {
    try {
      // ----------------------------------------
      // GET LOGIN TOKEN
      // ----------------------------------------

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login before confirming the booking."
        );

        navigate("/login");
        return;
      }

      // ----------------------------------------
      // VALIDATE REQUIRED BOOKING DATA
      // ----------------------------------------

      if (!moveRequest) {
        alert(
          "Move details are missing. Please go back and enter your move details."
        );

        navigate("/create-request");
        return;
      }

      if (!selectedVehicle) {
        alert(
          "Please select a vehicle before confirming the booking."
        );

        navigate("/vehicle-selection");
        return;
      }

      if (!priceEstimate) {
        alert(
          "Price estimate is missing. Please calculate the price again."
        );

        navigate("/price-estimate");
        return;
      }

      // ----------------------------------------
      // PREPARE PRICE DATA
      // ----------------------------------------

      const bookingPriceEstimate = {
        distanceCharge,
        vehicleCharge,
        itemHandling,
        fragileHandling,
        serviceCharge,
        total: finalTotal,

        // Keep these names too for compatibility
        totalEstimate: finalTotal,
      };

      console.log(
        "Creating booking with data:",
        {
          moveRequest,
          movingItems,
          selectedVehicle,
          priceEstimate:
            bookingPriceEstimate,
        }
      );

      // ----------------------------------------
      // CREATE BOOKING IN MONGODB
      // ----------------------------------------

      const response = await API.post(
        "/bookings",
        {
          moveRequest,

          movingItems:
            movingItems || [],

          selectedVehicle,

          priceEstimate:
            bookingPriceEstimate,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "Booking API response:",
        response.data
      );

      // ----------------------------------------
      // CHECK API RESPONSE
      // ----------------------------------------

      if (!response.data.success) {
        alert(
          response.data.message ||
            "Unable to create booking."
        );

        return;
      }

      // ----------------------------------------
      // GET BOOKING CREATED BY BACKEND
      // ----------------------------------------

      const booking =
        response.data.booking;

      if (!booking) {
        alert(
          "Booking was created but booking details were not returned."
        );

        return;
      }

      // ----------------------------------------
      // SAVE CURRENT BOOKING
      // ----------------------------------------

      localStorage.setItem(
        "currentBooking",
        JSON.stringify(booking)
      );

      // ----------------------------------------
      // SAVE BOOKING HISTORY
      //
      // This keeps your existing Booking History
      // page working while MongoDB becomes the
      // actual backend source.
      // ----------------------------------------

      const existingHistory =
        localStorage.getItem(
          "bookingHistory"
        );

      let bookingHistory = [];

      if (existingHistory) {
        try {
          const parsedHistory =
            JSON.parse(
              existingHistory
            );

          if (
            Array.isArray(
              parsedHistory
            )
          ) {
            bookingHistory =
              parsedHistory;
          }
        } catch (error) {
          console.error(
            "Booking history error:",
            error
          );

          bookingHistory = [];
        }
      }

      // Add newest booking at top
      bookingHistory.unshift(
        booking
      );

      localStorage.setItem(
        "bookingHistory",
        JSON.stringify(
          bookingHistory
        )
      );

      // ----------------------------------------
      // SUCCESS MESSAGE
      // ----------------------------------------

      console.log(
        "Booking created successfully:",
        booking
      );

      // ----------------------------------------
      // GO TO BOOKING DETAILS
      // ----------------------------------------

      navigate(
        "/booking-details"
      );

    } catch (error) {
      // ----------------------------------------
      // API / SERVER ERROR
      // ----------------------------------------

      console.error(
        "Booking creation error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to create booking. Please try again.";

      alert(message);
    }
  };

  // ==========================================
  // USER DATA
  // ==========================================

  const userName =
    user?.name ||
    "Customer";

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="booking-confirmation-page">

      <Sidebar />

      <main className="booking-main">

        {/* ====================================
            TOPBAR
        ===================================== */}

        <header className="booking-topbar">

          <div className="booking-topbar-left">

            <button
              className="booking-back-button"
              onClick={() =>
                navigate(
                  "/price-estimate"
                )
              }
            >
              ←
            </button>

            <div>

              <h1>
                Booking Confirmation
              </h1>

              <p>
                Review and confirm your
                relocation booking
              </p>

            </div>

          </div>

          {/* USER AREA */}

          <div className="booking-user-area">

            <span className="booking-notification">
              🔔
            </span>

            <div className="booking-avatar">
              {userInitial}
            </div>

            <div className="booking-user-info">

              <strong>
                {userName}
              </strong>

              <span>
                Customer
              </span>

            </div>

          </div>

        </header>

        {/* ====================================
            PAGE CONTENT
        ===================================== */}

        <div className="booking-content">

          {/* ==================================
              PAGE HEADING
          =================================== */}

          <div className="booking-page-heading">

            <span>
              STEP 5 OF 5
            </span>

            <h2>
              Confirm Your Booking
            </h2>

            <p>
              Review your relocation
              details and estimated cost
              before confirming your booking.
            </p>

          </div>

          {/* ==================================
              PROGRESS
          =================================== */}

          <div className="booking-progress">

            {/* STEP 1 */}

            <div className="booking-progress-step completed">

              <div className="booking-progress-circle">
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

            <div className="booking-progress-line"></div>

            {/* STEP 2 */}

            <div className="booking-progress-step completed">

              <div className="booking-progress-circle">
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

            <div className="booking-progress-line"></div>

            {/* STEP 3 */}

            <div className="booking-progress-step completed">

              <div className="booking-progress-circle">
                ✓
              </div>

              <div>

                <strong>
                  Vehicle
                </strong>

                <span>
                  Selected
                </span>

              </div>

            </div>

            <div className="booking-progress-line"></div>

            {/* STEP 4 */}

            <div className="booking-progress-step completed">

              <div className="booking-progress-circle">
                ✓
              </div>

              <div>

                <strong>
                  Estimate
                </strong>

                <span>
                  Review cost
                </span>

              </div>

            </div>

            <div className="booking-progress-line"></div>

            {/* STEP 5 */}

            <div className="booking-progress-step current">

              <div className="booking-progress-circle">
                5
              </div>

              <div>

                <strong>
                  Confirm
                </strong>

                <span>
                  Booking
                </span>

              </div>

            </div>

          </div>

          {/* ==================================
              MAIN GRID
          =================================== */}

          <div className="booking-layout">

            {/* =================================
                LEFT DETAILS CARD
            ================================== */}

            <section className="booking-details-card">

              {/* CARD HEADER */}

              <div className="booking-card-header">

                <div className="booking-card-icon">
                  📦
                </div>

                <div>

                  <h3>
                    Move Details
                  </h3>

                  <p>
                    Your relocation information
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div className="booking-status-box">

                <span>
                  BOOKING STATUS
                </span>

                <strong>
                  Ready to Confirm
                </strong>

              </div>

              {/* PROPERTY + DATE */}

              <div className="booking-info-grid">

                {/* PROPERTY TYPE */}

                <div className="booking-info-box">

                  <span>
                    PROPERTY TYPE
                  </span>

                  <strong>
                    {formatPropertyType(
                      moveRequest?.propertyType
                    )}
                  </strong>

                </div>

                {/* MOVING DATE */}

                <div className="booking-info-box">

                  <span>
                    MOVING DATE
                  </span>

                  <strong>
                    {formatDate(
                      moveRequest?.movingDate
                    )}
                  </strong>

                </div>

              </div>

              {/* =================================
                  ROUTE
              ================================== */}

              <div className="booking-route-box">

                {/* PICKUP */}

                <div className="booking-route-item">

                  <div className="booking-route-icon">
                    📍
                  </div>

                  <div>

                    <span>
                      PICKUP LOCATION
                    </span>

                    <strong>
                      {pickupLocation}
                    </strong>

                  </div>

                </div>

                {/* ROUTE LINE */}

                <div className="booking-route-line"></div>

                {/* DESTINATION */}

                <div className="booking-route-item">

                  <div className="booking-route-icon destination">
                    🏁
                  </div>

                  <div>

                    <span>
                      DESTINATION
                    </span>

                    <strong>
                      {destination}
                    </strong>

                  </div>

                </div>

              </div>

              {/* =================================
                  SELECTED VEHICLE
              ================================== */}

              <div className="booking-section-card">

                <div className="booking-section-title">

                  <div className="booking-section-icon">
                    🚚
                  </div>

                  <div>

                    <h3>
                      Selected Vehicle
                    </h3>

                    <p>
                      Vehicle selected for your move
                    </p>

                  </div>

                </div>

                <div className="booking-vehicle-box">

                  <div className="booking-vehicle-image">
                    🚚
                  </div>

                  <div className="booking-vehicle-info">

                    <strong>
                      {selectedVehicle?.name ||
                        selectedVehicle?.vehicleName ||
                        "Mini Truck"}
                    </strong>

                    <span>
                      {selectedVehicle?.capacity ||
                        "Up to 500 kg"}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================
                  MOVING ITEMS
              ================================== */}

              <div className="booking-section-card">

                <div className="booking-section-title">

                  <div className="booking-section-icon">
                    📦
                  </div>

                  <div>

                    <h3>
                      Moving Items
                    </h3>

                    <p>
                      Your moving inventory
                    </p>

                  </div>

                </div>

                <div className="booking-item-summary">

                  <div>

                    <strong>
                      {getItemQuantity()}
                    </strong>

                    <span>
                      Total Items
                    </span>

                  </div>

                  <div>

                    <strong>
                      {getFragileQuantity()}
                    </strong>

                    <span>
                      Fragile Items
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================
                RIGHT PRICE CARD
            ================================== */}

            <aside className="booking-price-card">

              {/* PRICE HEADER */}

              <div className="booking-price-header">

                <div>

                  <span>
                    ESTIMATED TOTAL
                  </span>

                  <h2>
                    ₹
                    {finalTotal.toLocaleString(
                      "en-IN"
                    )}
                  </h2>

                  <p>
                    Final estimate from your
                    Price Estimate page.
                  </p>

                </div>

                <div className="booking-money-icon">
                  💰
                </div>

              </div>

              {/* PRICE BREAKDOWN */}

              <div className="booking-price-breakdown">

                {/* DISTANCE */}

                <div className="booking-price-row">

                  <div>

                    <strong>
                      Distance Charge
                    </strong>

                    <span>
                      Estimated relocation distance
                    </span>

                  </div>

                  <b>
                    ₹
                    {distanceCharge.toLocaleString(
                      "en-IN"
                    )}
                  </b>

                </div>

                {/* VEHICLE */}

                <div className="booking-price-row">

                  <div>

                    <strong>
                      Vehicle Charge
                    </strong>

                    <span>
                      {selectedVehicle?.name ||
                        "Selected vehicle"}
                    </span>

                  </div>

                  <b>
                    ₹
                    {vehicleCharge.toLocaleString(
                      "en-IN"
                    )}
                  </b>

                </div>

                {/* ITEM HANDLING */}

                <div className="booking-price-row">

                  <div>

                    <strong>
                      Item Handling
                    </strong>

                    <span>
                      Based on moving inventory
                    </span>

                  </div>

                  <b>
                    ₹
                    {itemHandling.toLocaleString(
                      "en-IN"
                    )}
                  </b>

                </div>

                {/* FRAGILE HANDLING */}

                <div className="booking-price-row">

                  <div>

                    <strong>
                      Fragile Handling
                    </strong>

                    <span>
                      Based on fragile items
                    </span>

                  </div>

                  <b>
                    ₹
                    {fragileHandling.toLocaleString(
                      "en-IN"
                    )}
                  </b>

                </div>

                {/* ADDITIONAL SERVICES */}

                {serviceCharge > 0 && (
                  <div className="booking-price-row">

                    <div>

                      <strong>
                        Additional Services
                      </strong>

                      <span>
                        Extra service charges
                      </span>

                    </div>

                    <b>
                      ₹
                      {serviceCharge.toLocaleString(
                        "en-IN"
                      )}
                    </b>

                  </div>
                )}

              </div>

              {/* =================================
                  TOTAL
              ================================== */}

              <div className="booking-total-row">

                <strong>
                  Total Estimated Cost
                </strong>

                <span>
                  ₹
                  {finalTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* =================================
                  SECURITY MESSAGE
              ================================== */}

              <div className="booking-security-box">

                <span>
                  🔒
                </span>

                <p>
                  Your booking information is
                  securely stored and can be
                  tracked from your dashboard.
                </p>

              </div>

              {/* =================================
                  CONFIRM BUTTON
              ================================== */}

              <button
                className="booking-confirm-button"
                onClick={
                  handleConfirmBooking
                }
              >
                Confirm Booking

                <span>
                  →
                </span>

              </button>

              {/* =================================
                  BACK BUTTON
              ================================== */}

              <button
                className="booking-back-estimate-button"
                onClick={() =>
                  navigate(
                    "/price-estimate"
                  )
                }
              >
                ← Back to Price Estimate
              </button>

            </aside>

          </div>

          {/* ==================================
              FOOTER
          =================================== */}

          <footer className="booking-footer">
            © 2026 Move-Home — Digital Relocation Management.
          </footer>

        </div>

      </main>

    </div>
  );
};

export default BookingConfirmation;