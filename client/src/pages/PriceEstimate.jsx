import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CustomerDashboard.css";
import "./PriceEstimate.css";
import Sidebar from "../components/Sidebar";


/* =========================================================
   ICONS
========================================================= */

const TruckIcon = ({ size = 21 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h11v11H3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    <path
      d="M14 10h4l3 3v4h-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    <circle
      cx="7"
      cy="18"
      r="2"
      stroke="currentColor"
      strokeWidth="2"
    />

    <circle
      cx="18"
      cy="18"
      r="2"
      stroke="currentColor"
      strokeWidth="2"
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


const PackageIcon = ({ size = 27 }) => (
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


/* =========================================================
   PRICE ESTIMATE
========================================================= */

const PriceEstimate = () => {

  const navigate = useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [moveRequest, setMoveRequest] =
    useState(null);

  const [movingItems, setMovingItems] =
    useState([]);

  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  const [user, setUser] =
    useState(null);


  /* =======================================================
     TEMPORARY DISTANCE

     Later connect this with real map distance.
  ======================================================= */

  const [distance] = useState(25);


  /* =======================================================
     LOAD SAVED DATA
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
       LOAD DATA
    ------------------------------------------------------- */

    try {

      if (savedUser) {

        setUser(
          JSON.parse(savedUser)
        );

      }


      if (
        !savedMoveRequest ||
        !savedVehicle
      ) {

        navigate("/create-move");

        return;
      }


      setMoveRequest(
        JSON.parse(savedMoveRequest)
      );


      setMovingItems(
        savedItems
          ? JSON.parse(savedItems)
          : []
      );


      setSelectedVehicle(
        JSON.parse(savedVehicle)
      );

    } catch (error) {

      console.error(
        "Error loading saved move data:",
        error
      );

      navigate("/create-move");

    }

  }, [navigate]);


  /* =======================================================
     FORMAT PROPERTY TYPE

     1bhk  -> 1 BHK
     1BHK  -> 1 BHK
     2bhk  -> 2 BHK
     2 BHK -> 2 BHK
  ======================================================= */

  const formatPropertyType = (value) => {

    if (!value) {
      return "Not selected";
    }


    const cleaned =
      String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");


    const match =
      cleaned.match(/^(\d+)(bhk)$/);


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


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (dateString) => {

    if (!dateString) {

      return "Not selected";

    }


    const date =
      new Date(dateString);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return dateString;

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


  /* =======================================================
     FORMAT PRICE
  ======================================================= */

  const formatPrice = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  /* =======================================================
     WAITING STATE
  ======================================================= */

  if (
    !moveRequest ||
    !selectedVehicle
  ) {

    return (

      <div className="dashboard price-estimate-page">

        <Sidebar />

        <main className="main-area">

          <div className="loading-state">

            <div className="loading-spinner"></div>

            <p>
              Loading price estimate...
            </p>

          </div>

        </main>

      </div>

    );

  }


  /* =======================================================
     ITEM CALCULATIONS
  ======================================================= */

  const totalQuantity =
    movingItems.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );


  const fragileCount =
    movingItems.reduce(
      (total, item) => {

        const isFragile =
          item.fragile === true ||
          item.isFragile === true ||
          item.fragile === "Yes";


        return isFragile
          ? total +
              Number(
                item.quantity || 0
              )
          : total;

      },
      0
    );


  /* =======================================================
     PRICE CALCULATIONS
  ======================================================= */

  const vehicleBaseFare =
    Number(
      selectedVehicle.price || 0
    );


  const distanceRate = 18;


  const distanceCharge =
    distance *
    distanceRate;


  const itemHandlingRate = 35;


  const itemHandlingCharge =
    totalQuantity *
    itemHandlingRate;


  const fragileHandlingRate = 75;


  const fragileHandlingCharge =
    fragileCount *
    fragileHandlingRate;


  const serviceCharge = 0;


  const totalEstimate =
    vehicleBaseFare +
    distanceCharge +
    itemHandlingCharge +
    fragileHandlingCharge +
    serviceCharge;


  /* =======================================================
     SAVE ESTIMATE + CONTINUE
  ======================================================= */

  const handleContinue = () => {

    const estimateData = {

      vehicleBaseFare,

      distance,

      distanceRate,

      distanceCharge,

      totalQuantity,

      itemHandlingRate,

      itemHandlingCharge,

      fragileCount,

      fragileHandlingRate,

      fragileHandlingCharge,

      serviceCharge,

      totalEstimate,

      estimatedAt:
        new Date().toISOString(),

      distanceSource: "demo",

    };


    localStorage.setItem(
      "priceEstimate",
      JSON.stringify(
        estimateData
      )
    );


    navigate(
      "/booking-confirmation"
    );

  };


  /* =======================================================
     FIRST NAME
  ======================================================= */

  const firstName =
    user?.name
      ?.split(" ")[0] ||
    "Customer";


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="dashboard price-estimate-page">


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


            <ChevronIcon />

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

          <section className="price-page-header">

            <div>

              <div className="price-page-label">
                MOVING REQUEST
              </div>


              <h1>
                Review Your Price Estimate
              </h1>


              <p>

                Check your move details and estimated
                relocation cost before confirming your booking.

              </p>

            </div>


            <button
              className="price-back-button"
              onClick={() =>
                navigate(
                  "/vehicle-selection"
                )
              }
            >

              ← Vehicle

            </button>

          </section>


          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="price-progress-card">


            {/* STEP 1 */}

            <div className="price-progress-step completed">

              <div className="price-progress-circle">
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


            <div className="price-progress-line completed"></div>


            {/* STEP 2 */}

            <div className="price-progress-step completed">

              <div className="price-progress-circle">
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


            <div className="price-progress-line completed"></div>


            {/* STEP 3 */}

            <div className="price-progress-step completed">

              <div className="price-progress-circle">
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


            <div className="price-progress-line completed"></div>


            {/* STEP 4 */}

            <div className="price-progress-step active">

              <div className="price-progress-circle">
                4
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

          </div>


          {/* ==================================================
              ESTIMATE LAYOUT
          ================================================== */}

          <div className="price-estimate-layout">


            {/* ================================================
                LEFT SIDE
            ================================================= */}

            <div className="price-left">


              {/* =================================================
                  MOVE DETAILS
              ================================================= */}

              <section className="price-card">

                <div className="price-card-header">

                  <div>

                    <h2>
                      Move Details
                    </h2>

                    <p>
                      Your relocation information
                    </p>

                  </div>


                  <div className="price-card-icon">

                    <PackageIcon size={26} />

                  </div>

                </div>


                <div className="price-details-grid">


                  {/* PICKUP */}

                  <div className="price-detail">

                    <span>
                      PICKUP LOCATION
                    </span>


                    <strong>

                      {moveRequest.pickupAddress ||
                        "Not provided"}

                    </strong>

                  </div>


                  {/* DESTINATION */}

                  <div className="price-detail">

                    <span>
                      DESTINATION
                    </span>


                    <strong>

                      {moveRequest.destinationAddress ||
                        "Not provided"}

                    </strong>

                  </div>


                  {/* DATE */}

                  <div className="price-detail">

                    <span>
                      MOVING DATE
                    </span>


                    <strong>

                      {formatDate(
                        moveRequest.movingDate
                      )}

                    </strong>

                  </div>


                  {/* PROPERTY TYPE */}

                  <div className="price-detail">

                    <span>
                      PROPERTY TYPE
                    </span>


                    <strong>

                      {formatPropertyType(
                        moveRequest.propertyType
                      )}

                    </strong>

                  </div>

                </div>

              </section>


              {/* =================================================
                  SELECTED VEHICLE
              ================================================= */}

              <section className="price-card">

                <div className="price-card-header">

                  <div>

                    <h2>
                      Selected Vehicle
                    </h2>

                    <p>
                      Vehicle selected for your move
                    </p>

                  </div>


                  <div className="price-card-icon">
                    🚚
                  </div>

                </div>


                <div className="selected-vehicle-box">


                  <div className="selected-vehicle-icon">
                    🚚
                  </div>


                  <div className="selected-vehicle-info">

                    <h3>
                      {selectedVehicle.name}
                    </h3>


                    <p>

                      {selectedVehicle.capacity ||
                        "Suitable for household relocation"}

                    </p>


                    <div className="vehicle-features">

                      {selectedVehicle.features?.map(
                        (feature, index) => (

                          <span key={index}>

                            ✓ {feature}

                          </span>

                        )
                      )}

                    </div>

                  </div>


                  <button
                    className="change-vehicle-button"
                    onClick={() =>
                      navigate(
                        "/vehicle-selection"
                      )
                    }
                  >

                    Change

                  </button>

                </div>

              </section>


              {/* =================================================
                  ITEMS SUMMARY
              ================================================= */}

              <section className="price-card">

                <div className="price-card-header">

                  <div>

                    <h2>
                      Items Summary
                    </h2>

                    <p>
                      Inventory included in your move
                    </p>

                  </div>


                  <div className="price-card-icon">
                    📦
                  </div>

                </div>


                {/* SUMMARY */}

                <div className="items-summary-grid">


                  <div className="summary-box">

                    <strong>
                      {movingItems.length}
                    </strong>

                    <span>
                      Item Types
                    </span>

                  </div>


                  <div className="summary-box">

                    <strong>
                      {totalQuantity}
                    </strong>

                    <span>
                      Total Items
                    </span>

                  </div>


                  <div className="summary-box">

                    <strong>
                      {fragileCount}
                    </strong>

                    <span>
                      Fragile Items
                    </span>

                  </div>

                </div>


                {/* ITEMS LIST */}

                <div className="items-list">

                  {movingItems.length > 0 ? (

                    movingItems.map(
                      (item, index) => (

                        <div
                          className="item-row"
                          key={
                            item.id ||
                            index
                          }
                        >


                          <div className="item-name">

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
                            {item.quantity ||
                              0}

                          </span>


                          <span>

                            {item.fragile === true ||
                            item.isFragile === true ||
                            item.fragile === "Yes"
                              ? "Fragile"
                              : "Standard"}

                          </span>

                        </div>

                      )

                    )

                  ) : (

                    <p className="empty-items">

                      No items added.

                    </p>

                  )}

                </div>

              </section>

            </div>


            {/* ================================================
                RIGHT SIDE - PRICE
            ================================================= */}

            <aside className="price-right">


              {/* =================================================
                  FINAL PRICE
              ================================================= */}

              <section className="final-price-card">


                {/* HEADER */}

                <div className="final-price-header">

                  <div>

                    <span>
                      ESTIMATED TOTAL
                    </span>


                    <h2>

                      {formatPrice(
                        totalEstimate
                      )}

                    </h2>


                    <p>

                      Estimated relocation cost based
                      on the information provided.

                    </p>

                  </div>


                  <div className="money-icon">
                    💰
                  </div>

                </div>


                {/* =================================================
                    BREAKDOWN
                ================================================= */}

                <div className="price-breakdown">


                  {/* DISTANCE */}

                  <div className="price-row">

                    <div>

                      <strong>
                        Distance Charge
                      </strong>


                      <span>

                        {distance} km × ₹
                        {distanceRate}/km

                      </span>

                    </div>


                    <strong>

                      {formatPrice(
                        distanceCharge
                      )}

                    </strong>

                  </div>


                  {/* VEHICLE */}

                  <div className="price-row">

                    <div>

                      <strong>
                        Vehicle Charge
                      </strong>


                      <span>
                        Selected vehicle
                      </span>

                    </div>


                    <strong>

                      {formatPrice(
                        vehicleBaseFare
                      )}

                    </strong>

                  </div>


                  {/* ITEMS */}

                  <div className="price-row">

                    <div>

                      <strong>
                        Item Handling
                      </strong>


                      <span>

                        ₹{itemHandlingRate} ×{" "}
                        {totalQuantity} items

                      </span>

                    </div>


                    <strong>

                      {formatPrice(
                        itemHandlingCharge
                      )}

                    </strong>

                  </div>


                  {/* FRAGILE */}

                  <div className="price-row">

                    <div>

                      <strong>
                        Fragile Item Handling
                      </strong>


                      <span>

                        ₹{fragileHandlingRate} ×{" "}
                        {fragileCount} fragile items

                      </span>

                    </div>


                    <strong>

                      {formatPrice(
                        fragileHandlingCharge
                      )}

                    </strong>

                  </div>

                </div>


                {/* =================================================
                    TOTAL
                ================================================= */}

                <div className="final-total">

                  <span>
                    Total Estimated Cost
                  </span>


                  <strong>

                    {formatPrice(
                      totalEstimate
                    )}

                  </strong>

                </div>


                {/* =================================================
                    DEMO DISTANCE NOTICE
                ================================================= */}

                <div className="distance-notice">

                  <div>
                    📍
                  </div>


                  <div>

                    <strong>
                      Distance currently estimated
                    </strong>


                    <p>

                      The current prototype uses a
                      temporary 25 km distance.
                      Real map-based distance calculation
                      will be connected in the next stage.

                    </p>

                  </div>

                </div>


                {/* =================================================
                    CONTINUE
                ================================================= */}

                <button
                  className="confirm-estimate-button"
                  onClick={handleContinue}
                >

                  Continue to Booking Confirmation

                  <span>
                    →
                  </span>

                </button>


                {/* BACK */}

                <button
                  className="back-estimate-button"
                  onClick={() =>
                    navigate(
                      "/vehicle-selection"
                    )
                  }
                >

                  ← Back to Vehicle

                </button>

              </section>


              {/* =================================================
                  INFO CARD
              ================================================= */}

              <div className="estimate-info-card">

                <div className="info-icon">
                  🔒
                </div>


                <div>

                  <h4>
                    Transparent Pricing
                  </h4>


                  <p>

                    This estimate is calculated from
                    your selected vehicle, move distance,
                    inventory and handling requirements.

                  </p>

                </div>

              </div>

            </aside>

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="dashboard-footer">

            <p>

              © 2026 Move-Home.
              Digital Relocation Management.

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


export default PriceEstimate;