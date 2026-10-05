import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./BookingDetails.css";
import Sidebar from "../components/Sidebar";

const BookingDetails = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);

  // ==========================================
  // LOAD BOOKING + USER DATA
  // ==========================================

  useEffect(() => {
    try {
      const savedBooking =
        localStorage.getItem("currentBooking");

      const savedUser =
        localStorage.getItem("user");

      // ----------------------------------------
      // BOOKING REQUIRED
      // ----------------------------------------

      if (!savedBooking) {
        navigate("/booking-confirmation");
        return;
      }

      const parsedBooking =
        JSON.parse(savedBooking);

      setBooking(parsedBooking);

      // ----------------------------------------
      // USER
      // ----------------------------------------

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

    } catch (error) {
      console.error(
        "Error loading booking details:",
        error
      );

      navigate("/booking-confirmation");
    }
  }, [navigate]);

  // ==========================================
  // GET USER INITIAL
  // ==========================================

  const getInitial = () => {
    if (user?.name) {
      return user.name
        .charAt(0)
        .toUpperCase();
    }

    return "D";
  };

  // ==========================================
  // FORMAT PROPERTY TYPE
  // ==========================================

  const formatPropertyType = (value) => {
    if (!value) {
      return "Not selected";
    }

    const cleaned = String(value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const match =
      cleaned.match(/^(\d+)bhk$/);

    if (match) {
      return `${match[1]} BHK`;
    }

    if (cleaned === "studio") {
      return "Studio";
    }

    return String(value)
      .trim()
      .replace(/\bbhk\b/gi, "BHK");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (value) => {
    if (!value) {
      return "Not selected";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
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
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (value) => {
    const amount =
      Number(value || 0);

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!booking) {
    return (
      <div className="booking-details-loading">

        <div className="booking-details-spinner"></div>

        <p>
          Loading booking details...
        </p>

      </div>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const moveRequest =
    booking.moveRequest || {};

  const movingItems =
    Array.isArray(booking.movingItems)
      ? booking.movingItems
      : [];

  const selectedVehicle =
    booking.selectedVehicle || {};

  const priceEstimate =
    booking.priceEstimate || {};

  // =========================================================
  // LOCATIONS
  // =========================================================

  const pickup =
    moveRequest.pickupAddress ||
    moveRequest.pickup ||
    "Not provided";

  const destination =
    moveRequest.destinationAddress ||
    moveRequest.destination ||
    "Not provided";

  // =========================================================
  // MOVE INFORMATION
  // =========================================================

  const propertyType =
    formatPropertyType(
      moveRequest.propertyType
    );

  const movingDate =
    formatDate(
      moveRequest.movingDate
    );

  // =========================================================
  // PRICE DATA
  //
  // These names match the current
  // PriceEstimate / BookingConfirmation flow.
  // =========================================================

  const distanceCharge =
    Number(
      priceEstimate.distanceCharge || 0
    );

  const vehicleCharge =
    Number(
      priceEstimate.vehicleBaseFare ??
      priceEstimate.vehicleCharge ??
      0
    );

  const itemHandling =
    Number(
      priceEstimate.itemHandlingCharge ??
      priceEstimate.itemHandling ??
      0
    );

  const fragileHandling =
    Number(
      priceEstimate.fragileHandlingCharge ??
      priceEstimate.fragileHandling ??
      0
    );

  const serviceCharge =
    Number(
      priceEstimate.serviceCharge ??
      priceEstimate.additionalCharges ??
      0
    );

  const calculatedTotal =
    distanceCharge +
    vehicleCharge +
    itemHandling +
    fragileHandling +
    serviceCharge;

  const total =
    Number(
      priceEstimate.totalEstimate ??
      priceEstimate.total ??
      priceEstimate.totalEstimateAmount ??
      0
    ) || calculatedTotal;

  // =========================================================
  // ITEM COUNTS
  // =========================================================

  const totalQuantity =
    movingItems.reduce(
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

  const fragileCount =
    movingItems.reduce(
      (total, item) => {

        const fragile =
          item.fragile === true ||
          item.isFragile === true ||
          item.fragile === "Yes" ||
          item.fragile === "true";

        return fragile
          ? total +
              Number(
                item.quantity || 0
              )
          : total;
      },
      0
    );

  // =========================================================
  // VEHICLE
  // =========================================================

  const vehicleName =
    selectedVehicle.name ||
    selectedVehicle.vehicleName ||
    "Mini Truck";

  const vehicleCapacity =
    selectedVehicle.capacity ||
    "Suitable for household relocation";

  // =========================================================
  // BOOKING ID
  // =========================================================

  const bookingId =
    booking.bookingId ||
    "MH-PENDING";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="booking-details-page">

      {/* =====================================================
          COMMON SIDEBAR
      ===================================================== */}

      <Sidebar />


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="bd-main-area">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="bd-topbar">

          <div className="bd-topbar-left">

            <button
              className="bd-back-button"
              onClick={() =>
                navigate(
                  "/booking-confirmation"
                )
              }
            >
              ←
            </button>

            <div>

              <h1>
                Booking Details
              </h1>

              <p>
                View your confirmed relocation booking
              </p>

            </div>

          </div>


          {/* ===============================================
              USER AREA
          ================================================ */}

          <div className="bd-topbar-right">

            <div className="bd-notification">
              🔔
            </div>

            <div className="bd-user-avatar">
              {getInitial()}
            </div>

            <div className="bd-user-info">

              <strong>
                {user?.name || "Customer"}
              </strong>

              <span>
                Customer
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="bd-content">

          {/* ===============================================
              PAGE HEADER
          ================================================ */}

          <section className="bd-page-header">

            <div>

              <span className="bd-page-label">
                CONFIRMED BOOKING
              </span>

              <h2>
                Booking Details
              </h2>

              <p>
                Your relocation booking has been confirmed.
                Keep this booking ID for future reference.
              </p>

            </div>


            {/* BOOKING ID */}

            <div className="bd-booking-id">

              <span>
                BOOKING ID
              </span>

              <strong>
                {bookingId}
              </strong>

            </div>

          </section>


          {/* ===============================================
              SUCCESS CARD
          ================================================ */}

          <div className="bd-success-card">

            <div className="bd-success-icon">
              ✓
            </div>

            <div>

              <h3>
                Booking Confirmed Successfully
              </h3>

              <p>
                Your moving request has been saved.
                You can track its progress from the
                Track My Move page.
              </p>

            </div>

            <span className="bd-status-badge">
              Booking Confirmed
            </span>

          </div>


          {/* =================================================
              TWO COLUMN LAYOUT
          ================================================= */}

          <div className="bd-layout">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="bd-left">


              {/* =================================================
                  MOVE INFORMATION
              ================================================= */}

              <section className="bd-card">

                <div className="bd-card-header">

                  <div className="bd-card-icon">
                    📦
                  </div>

                  <div>

                    <h3>
                      Move Information
                    </h3>

                    <p>
                      Your confirmed relocation details
                    </p>

                  </div>

                </div>


                <div className="bd-card-body">

                  {/* PROPERTY + DATE */}

                  <div className="bd-info-grid">

                    <div className="bd-info-box">

                      <span>
                        PROPERTY TYPE
                      </span>

                      <strong>
                        {propertyType}
                      </strong>

                    </div>


                    <div className="bd-info-box">

                      <span>
                        MOVING DATE
                      </span>

                      <strong>
                        {movingDate}
                      </strong>

                    </div>

                  </div>


                  {/* ROUTE */}

                  <div className="bd-route">

                    {/* PICKUP */}

                    <div className="bd-route-point">

                      <div className="bd-route-icon pickup">
                        📍
                      </div>

                      <div>

                        <span>
                          PICKUP LOCATION
                        </span>

                        <strong>
                          {pickup}
                        </strong>

                      </div>

                    </div>


                    {/* ROUTE LINE */}

                    <div className="bd-route-line"></div>


                    {/* DESTINATION */}

                    <div className="bd-route-point">

                      <div className="bd-route-icon destination">
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

                </div>

              </section>


              {/* =================================================
                  SELECTED VEHICLE
              ================================================= */}

              <section className="bd-card">

                <div className="bd-card-header">

                  <div className="bd-card-icon">
                    🚚
                  </div>

                  <div>

                    <h3>
                      Selected Vehicle
                    </h3>

                    <p>
                      Vehicle assigned to your move
                    </p>

                  </div>

                </div>


                <div className="bd-vehicle-box">

                  <div className="bd-vehicle-icon">
                    🚚
                  </div>

                  <div className="bd-vehicle-info">

                    <h3>
                      {vehicleName}
                    </h3>

                    <p>
                      {vehicleCapacity}
                    </p>

                  </div>

                  <span className="bd-confirmed-small">
                    ✓ Selected
                  </span>

                </div>

              </section>


              {/* =================================================
                  MOVING ITEMS
              ================================================= */}

              <section className="bd-card">

                <div className="bd-card-header">

                  <div className="bd-card-icon">
                    📋
                  </div>

                  <div>

                    <h3>
                      Moving Items
                    </h3>

                    <p>
                      Inventory included in your move
                    </p>

                  </div>

                </div>


                {/* SUMMARY */}

                <div className="bd-items-summary">

                  <div className="bd-summary-box">

                    <strong>
                      {movingItems.length}
                    </strong>

                    <span>
                      Item Types
                    </span>

                  </div>


                  <div className="bd-summary-box">

                    <strong>
                      {totalQuantity}
                    </strong>

                    <span>
                      Total Items
                    </span>

                  </div>


                  <div className="bd-summary-box">

                    <strong>
                      {fragileCount}
                    </strong>

                    <span>
                      Fragile Items
                    </span>

                  </div>

                </div>


                {/* ITEM LIST */}

                {movingItems.length > 0 && (

                  <div className="bd-item-list">

                    {movingItems.map(
                      (item, index) => {

                        const isFragile =
                          item.fragile === true ||
                          item.isFragile === true ||
                          item.fragile === "Yes" ||
                          item.fragile === "true";

                        return (

                          <div
                            className="bd-item-row"
                            key={
                              item.id ||
                              index
                            }
                          >

                            <div className="bd-item-name">

                              <span>
                                📦
                              </span>

                              <strong>
                                {item.name ||
                                  item.itemName ||
                                  "Item"}
                              </strong>

                            </div>


                            <span>
                              Qty:{" "}
                              {item.quantity || 0}
                            </span>


                            <span
                              className={
                                isFragile
                                  ? "bd-fragile"
                                  : "bd-standard"
                              }
                            >
                              {isFragile
                                ? "Fragile"
                                : "Standard"}
                            </span>

                          </div>

                        );
                      }
                    )}

                  </div>

                )}

              </section>


              {/* =================================================
                  TRACKING CARD
              ================================================= */}

              <div className="bd-tracking-card">

                <div className="bd-tracking-icon">
                  🗺️
                </div>

                <div>

                  <span>
                    NEXT STEP
                  </span>

                  <h4>
                    Track Your Move
                  </h4>

                  <p>
                    Track your relocation status
                    and receive real-time updates
                    from the tracking page.
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/track-move"
                    )
                  }
                >
                  Track Move →
                </button>

              </div>

            </div>


            {/* =================================================
                RIGHT COLUMN - PRICE
            ================================================= */}

            <aside className="bd-right">

              <section className="bd-price-card">

                {/* PRICE HEADER */}

                <div className="bd-price-header">

                  <div>

                    <span>
                      ESTIMATED TOTAL
                    </span>

                    <h2>
                      {formatPrice(total)}
                    </h2>

                    <p>
                      Final estimate based on your
                      relocation details.
                    </p>

                  </div>


                  <div className="bd-money-icon">
                    💰
                  </div>

                </div>


                {/* PRICE BREAKDOWN */}

                <div className="bd-price-breakdown">

                  {/* DISTANCE */}

                  <div className="bd-price-row">

                    <div>

                      <strong>
                        Distance Charge
                      </strong>

                      <span>
                        Estimated relocation distance
                      </span>

                    </div>

                    <strong>
                      {formatPrice(
                        distanceCharge
                      )}
                    </strong>

                  </div>


                  {/* VEHICLE */}

                  <div className="bd-price-row">

                    <div>

                      <strong>
                        Vehicle Charge
                      </strong>

                      <span>
                        {vehicleName}
                      </span>

                    </div>

                    <strong>
                      {formatPrice(
                        vehicleCharge
                      )}
                    </strong>

                  </div>


                  {/* ITEM HANDLING */}

                  <div className="bd-price-row">

                    <div>

                      <strong>
                        Item Handling
                      </strong>

                      <span>
                        Based on moving inventory
                      </span>

                    </div>

                    <strong>
                      {formatPrice(
                        itemHandling
                      )}
                    </strong>

                  </div>


                  {/* FRAGILE HANDLING */}

                  <div className="bd-price-row">

                    <div>

                      <strong>
                        Fragile Handling
                      </strong>

                      <span>
                        Based on fragile items
                      </span>

                    </div>

                    <strong>
                      {formatPrice(
                        fragileHandling
                      )}
                    </strong>

                  </div>


                  {/* ADDITIONAL SERVICE */}

                  {serviceCharge > 0 && (

                    <div className="bd-price-row">

                      <div>

                        <strong>
                          Additional Services
                        </strong>

                        <span>
                          Extra service charges
                        </span>

                      </div>

                      <strong>
                        {formatPrice(
                          serviceCharge
                        )}
                      </strong>

                    </div>

                  )}

                </div>


                {/* TOTAL */}

                <div className="bd-total-row">

                  <span>
                    Total Estimated Cost
                  </span>

                  <strong>
                    {formatPrice(total)}
                  </strong>

                </div>


                {/* SECURITY */}

                <div className="bd-security">

                  <span>
                    🔒
                  </span>

                  <p>
                    Your booking information is
                    securely stored and can be
                    tracked from your dashboard.
                  </p>

                </div>


                {/* TRACK BUTTON */}

                <button
                  className="bd-track-button"
                  onClick={() =>
                    navigate(
                      "/track-move"
                    )
                  }
                >
                  Track My Move →
                </button>


                {/* BACK BUTTON */}

                <button
                  className="bd-back-page-button"
                  onClick={() =>
                    navigate(
                      "/dashboard"
                    )
                  }
                >
                  ← Back to Dashboard
                </button>

              </section>

            </aside>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="bd-footer">

            <p>
              © 2026 Move-Home — Digital Relocation Management.
            </p>

            <p>
              Moving made simple 🚚
            </p>

          </footer>

        </main>

      </div>

    </div>
  );
};

export default BookingDetails;