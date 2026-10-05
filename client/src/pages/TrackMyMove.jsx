import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import "./TrackMyMove.css";

const SOCKET_URL = "http://localhost:5000";

const TrackMyMove = () => {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  /*
  ==================================================
  LOAD USER + CURRENT BOOKING
  ==================================================
  */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedBooking = localStorage.getItem("currentBooking");

    if (!token) {
      navigate("/login");
      return;
    }

    /*
    Load user
    */

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(
          "User data error:",
          error
        );
      }
    }

    /*
    Load current booking
    */

    if (savedBooking) {
      try {
        const parsedBooking =
          JSON.parse(savedBooking);

        setBooking(parsedBooking);

      } catch (error) {
        console.error(
          "Booking data error:",
          error
        );
      }
    }
  }, [navigate]);


  /*
  ==================================================
  SOCKET.IO REAL-TIME CONNECTION
  ==================================================
  */

  useEffect(() => {

    /*
    No booking yet
    */

    if (!booking) {
      return;
    }

    /*
    Get booking MongoDB ID

    The Socket.IO room uses the MongoDB _id,
    not the human-readable bookingId.
    */

    const bookingMongoId =
      booking._id ||
      booking.id;

    if (!bookingMongoId) {

      console.warn(
        "Booking MongoDB ID not found. Socket.IO room cannot be joined."
      );

      return;
    }

    /*
    Create Socket.IO connection
    */

    const socket =
      io(SOCKET_URL, {
        transports: [
          "websocket",
          "polling",
        ],
      });

    /*
    ================================================
    SOCKET CONNECTED
    ================================================
    */

    socket.on(
      "connect",
      () => {

        console.log(
          "TrackMyMove Socket connected:",
          socket.id
        );

        setSocketConnected(true);

        /*
        Join booking-specific room
        */

        socket.emit(
          "join-booking",
          bookingMongoId
        );

        console.log(
          `Joined booking room: booking-${bookingMongoId}`
        );

      }
    );

    /*
    ================================================
    SOCKET CONNECTION ERROR
    ================================================
    */

    socket.on(
      "connect_error",
      (error) => {

        console.error(
          "TrackMyMove Socket connection error:",
          error.message
        );

        setSocketConnected(false);

      }
    );

    /*
    ================================================
    REAL-TIME BOOKING STATUS UPDATE
    ================================================
    */

    socket.on(
      "booking-status-updated",
      (updatedBooking) => {

        console.log(
          "Real-time booking update received:",
          updatedBooking
        );

        /*
        Update React state
        */

        setBooking(
          updatedBooking
        );

        /*
        Update localStorage
        so other customer pages
        can also access latest booking.
        */

        localStorage.setItem(
          "currentBooking",
          JSON.stringify(
            updatedBooking
          )
        );

        /*
        Update booking history if available
        */

        try {

          const savedHistory =
            localStorage.getItem(
              "bookingHistory"
            );

          if (savedHistory) {

            const history =
              JSON.parse(
                savedHistory
              );

            const updatedHistory =
              history.map(
                (item) => {

                  const itemId =
                    item._id ||
                    item.id;

                  const updatedId =
                    updatedBooking._id ||
                    updatedBooking.id;

                  if (
                    itemId &&
                    updatedId &&
                    itemId.toString() ===
                      updatedId.toString()
                  ) {

                    return updatedBooking;

                  }

                  return item;

                }
              );

            localStorage.setItem(
              "bookingHistory",
              JSON.stringify(
                updatedHistory
              )
            );

          }

        } catch (error) {

          console.error(
            "Booking history update error:",
            error
          );

        }

        /*
        Show latest update time
        */

        setLastUpdated(
          new Date()
        );

      }
    );

    /*
    ================================================
    SOCKET DISCONNECTED
    ================================================
    */

    socket.on(
      "disconnect",
      () => {

        console.log(
          "TrackMyMove Socket disconnected"
        );

        setSocketConnected(false);

      }
    );

    /*
    ================================================
    CLEANUP
    ================================================
    */

    return () => {

      /*
      Leave booking room
      */

      socket.emit(
        "leave-booking",
        bookingMongoId
      );

      /*
      Disconnect socket
      */

      socket.disconnect();

      console.log(
        `Left booking room: booking-${bookingMongoId}`
      );

    };

  }, [booking?._id, booking?.id]);


  /*
  ==================================================
  STATUS STEPS
  ==================================================
  */

  const statusSteps = [
    {
      key: "BOOKING_CONFIRMED",
      title: "Booking Confirmed",
      description:
        "Your moving request has been confirmed.",
      icon: "✓",
    },

    {
      key: "DRIVER_ASSIGNED",
      title: "Driver Assigned",
      description:
        "A driver has been assigned to your move.",
      icon: "🚚",
    },

    {
      key: "PICKUP_SCHEDULED",
      title: "Pickup Scheduled",
      description:
        "Your pickup has been scheduled.",
      icon: "📅",
    },

    {
      key: "ITEMS_LOADING",
      title: "Items Loading",
      description:
        "Your items are being loaded into the vehicle.",
      icon: "📦",
    },

    {
      key: "ITEMS_LOADED",
      title: "Items Loaded",
      description:
        "All items have been loaded successfully.",
      icon: "✓",
    },

    {
      key: "ON_THE_WAY",
      title: "On the Way",
      description:
        "Your items are currently being transported.",
      icon: "🚛",
    },

    {
      key: "ARRIVED",
      title: "Arrived",
      description:
        "The vehicle has arrived at the destination.",
      icon: "📍",
    },

    {
      key: "DELIVERED",
      title: "Delivered",
      description:
        "Your items have been delivered successfully.",
      icon: "🏠",
    },
  ];


  /*
  ==================================================
  CURRENT STATUS
  ==================================================
  */

  const getCurrentStatus = () => {

    if (!booking?.status) {
      return "BOOKING_CONFIRMED";
    }

    return booking.status;
  };

  const currentStatus =
    getCurrentStatus();


  /*
  ==================================================
  CURRENT STEP INDEX
  ==================================================
  */

  const currentStepIndex =
    statusSteps.findIndex(
      (step) =>
        step.key === currentStatus
    );


  /*
  ==================================================
  STEP STATE
  ==================================================
  */

  const getStepState = (index) => {

    if (
      currentStatus ===
      "CANCELLED"
    ) {

      return "cancelled";

    }

    if (
      index <
      currentStepIndex
    ) {

      return "completed";

    }

    if (
      index ===
      currentStepIndex
    ) {

      return "current";

    }

    return "upcoming";
  };


  /*
  ==================================================
  STATUS LABEL
  ==================================================
  */

  const getStatusLabel = (
    status
  ) => {

    const statusLabels = {

      BOOKING_CONFIRMED:
        "Booking Confirmed",

      DRIVER_ASSIGNED:
        "Driver Assigned",

      PICKUP_SCHEDULED:
        "Pickup Scheduled",

      ITEMS_LOADING:
        "Items Loading",

      ITEMS_LOADED:
        "Items Loaded",

      ON_THE_WAY:
        "On the Way",

      ARRIVED:
        "Arrived",

      DELIVERED:
        "Delivered",

      CANCELLED:
        "Cancelled",

    };

    return (
      statusLabels[status] ||
      "Booking Confirmed"
    );
  };


  /*
  ==================================================
  STATUS MESSAGE
  ==================================================
  */

  const getStatusMessage = () => {

    const messages = {

      BOOKING_CONFIRMED:
        "Your booking is confirmed. We are preparing your move.",

      DRIVER_ASSIGNED:
        "A driver has been assigned and will handle your relocation.",

      PICKUP_SCHEDULED:
        "Your pickup has been scheduled. Please keep your items ready.",

      ITEMS_LOADING:
        "Your items are currently being loaded into the vehicle.",

      ITEMS_LOADED:
        "All your items have been loaded. The move is ready to start.",

      ON_THE_WAY:
        "Your belongings are currently on the way to the destination.",

      ARRIVED:
        "The vehicle has arrived at your destination.",

      DELIVERED:
        "Your move has been completed successfully.",

      CANCELLED:
        "This moving request has been cancelled.",

    };

    return (
      messages[currentStatus] ||
      "Your moving request is being processed."
    );
  };


  /*
  ==================================================
  PROGRESS PERCENTAGE
  ==================================================
  */

  const getProgressPercentage = () => {

    if (
      currentStatus ===
      "CANCELLED"
    ) {

      return 0;

    }

    if (
      currentStatus ===
      "DELIVERED"
    ) {

      return 100;

    }

    if (
      currentStepIndex < 0
    ) {

      return 0;

    }

    return Math.round(
      (
        currentStepIndex /
        (statusSteps.length - 1)
      ) * 100
    );
  };


  /*
  ==================================================
  FORMAT DATE
  ==================================================
  */

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "Not available";
    }

    try {

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch (error) {

      return date;

    }
  };


  /*
  ==================================================
  FORMAT PROPERTY TYPE
  ==================================================
  */

  const formatPropertyType = (
    propertyType
  ) => {

    if (!propertyType) {
      return "Not specified";
    }

    return propertyType
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };


  /*
  ==================================================
  VIEW BOOKING
  ==================================================
  */

  const handleViewBooking = () => {

    navigate(
      "/booking-details"
    );

  };


  /*
  ==================================================
  BACK TO DASHBOARD
  ==================================================
  */

  const handleBackDashboard = () => {

    navigate(
      "/dashboard"
    );

  };


  /*
  ==================================================
  EMPTY BOOKING STATE
  ==================================================
  */

  if (!booking) {

    return (

      <div className="dashboard track-page">

        <Sidebar />

        <main className="track-main">

          <div className="track-empty-state">

            <div className="track-empty-icon">
              🚚
            </div>

            <h2>
              No Active Move Found
            </h2>

            <p>
              You don't have an active moving request to track right now.
            </p>

            <button
              className="track-primary-button"
              onClick={() =>
                navigate(
                  "/create-move"
                )
              }
            >
              Create Moving Request
            </button>

          </div>

        </main>

      </div>

    );

  }


  /*
  ==================================================
  BOOKING DATA
  ==================================================
  */

  const moveRequest =
    booking.moveRequest ||
    {};

  /*
  Your MongoDB uses selectedVehicle.
  Keep vehicle fallback for compatibility.
  */

  const vehicle =
    booking.selectedVehicle ||
    booking.vehicle ||
    {};

  const items =
    booking.movingItems ||
    booking.items ||
    [];


  /*
  ==================================================
  LOCATIONS
  ==================================================
  */

  const pickupLocation =
    moveRequest.pickupAddress ||
    moveRequest.pickupLocation ||
    "Pickup location";

  const destinationLocation =
    moveRequest.destinationAddress ||
    moveRequest.destinationLocation ||
    "Destination location";


  /*
  ==================================================
  BOOKING ID
  ==================================================
  */

  const bookingId =
    booking.bookingId ||
    booking._id ||
    "MH-000000";


  /*
  ==================================================
  ITEM COUNT
  ==================================================
  */

  const itemCount =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );


  /*
  ==================================================
  PROGRESS
  ==================================================
  */

  const progressPercentage =
    getProgressPercentage();


  /*
  ==================================================
  RENDER
  ==================================================
  */

  return (

    <div className="dashboard track-page">

      <Sidebar />

      <main className="track-main">

        {/* ==========================================
            TOP BAR
        ========================================== */}

        <header className="track-topbar">

          <div>

            <p className="track-breadcrumb">
              Move-Home / Tracking
            </p>

            <h1>
              Track My Move
            </h1>

            <p className="track-topbar-subtitle">
              Monitor your relocation status in real time.
            </p>

          </div>


          <div className="track-user-area">

            <div className="track-user-avatar">

              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </div>

            <div className="track-user-info">

              <strong>
                {user?.name ||
                  "Customer"}
              </strong>

              <span>
                Customer
              </span>

            </div>

          </div>

        </header>


        {/* ==========================================
            ACTIVE BOOKING HEADER
        ========================================== */}

        <section className="track-booking-header">

          <div className="track-booking-title">

            <div className="track-truck-icon">
              🚚
            </div>

            <div>

              <span className="track-small-label">
                ACTIVE MOVING REQUEST
              </span>

              <h2>
                {bookingId}
              </h2>

              <p>
                Created on{" "}
                {formatDate(
                  booking.createdAt
                )}
              </p>

            </div>

          </div>


          <div
            className={`track-status-badge ${
              currentStatus ===
              "CANCELLED"
                ? "cancelled"
                : currentStatus ===
                  "DELIVERED"
                ? "delivered"
                : "active"
            }`}
          >

            <span className="track-status-dot"></span>

            {getStatusLabel(
              currentStatus
            )}

          </div>

        </section>


        {/* ==========================================
            CURRENT STATUS CARD
        ========================================== */}

        <section className="track-current-status-card">

          <div className="track-current-status-icon">

            {currentStatus ===
            "DELIVERED"
              ? "✓"
              : currentStatus ===
                "CANCELLED"
              ? "!"
              : "🚚"}

          </div>


          <div className="track-current-status-content">

            <span className="track-current-label">
              CURRENT STATUS
            </span>

            <h2>
              {getStatusLabel(
                currentStatus
              )}
            </h2>

            <p>
              {getStatusMessage()}
            </p>

          </div>


          <div className="track-progress-box">

            <div className="track-progress-top">

              <span>
                Move Progress
              </span>

              <strong>
                {progressPercentage}%
              </strong>

            </div>

            <div className="track-progress-bar">

              <div
                className="track-progress-fill"
                style={{
                  width:
                    `${progressPercentage}%`,
                }}
              ></div>

            </div>

          </div>

        </section>


        {/* ==========================================
            ROUTE SECTION
        ========================================== */}

        <section className="track-route-card">

          <div className="track-section-heading">

            <div>

              <span className="track-section-label">
                JOURNEY
              </span>

              <h2>
                Moving Route
              </h2>

            </div>


            <div className="track-live-indicator">

              <span></span>

              Live Tracking

            </div>

          </div>


          <div className="track-route">

            <div className="track-route-point pickup">

              <div className="track-route-icon">
                📦
              </div>

              <div className="track-route-content">

                <span>
                  Pickup Location
                </span>

                <strong>
                  {pickupLocation}
                </strong>

              </div>

            </div>


            <div className="track-route-line">

              <div className="track-route-line-progress"></div>

            </div>


            <div className="track-route-point destination">

              <div className="track-route-icon">
                🏠
              </div>

              <div className="track-route-content">

                <span>
                  Destination
                </span>

                <strong>
                  {destinationLocation}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            DETAILS GRID
        ========================================== */}

        <section className="track-info-grid">

          <div className="track-info-card">

            <div className="track-info-icon">
              📅
            </div>

            <div>

              <span>
                Moving Date
              </span>

              <strong>
                {formatDate(
                  moveRequest.movingDate
                )}
              </strong>

            </div>

          </div>


          <div className="track-info-card">

            <div className="track-info-icon">
              🏠
            </div>

            <div>

              <span>
                Property Type
              </span>

              <strong>
                {formatPropertyType(
                  moveRequest.propertyType
                )}
              </strong>

            </div>

          </div>


          <div className="track-info-card">

            <div className="track-info-icon">
              📦
            </div>

            <div>

              <span>
                Total Items
              </span>

              <strong>
                {itemCount} Items
              </strong>

            </div>

          </div>


          <div className="track-info-card">

            <div className="track-info-icon">
              🚛
            </div>

            <div>

              <span>
                Vehicle
              </span>

              <strong>
                {vehicle.name ||
                  "Vehicle Assigned"}
              </strong>

            </div>

          </div>

        </section>


        {/* ==========================================
            STATUS TIMELINE
        ========================================== */}

        <section className="track-timeline-card">

          <div className="track-section-heading">

            <div>

              <span className="track-section-label">
                TRACKING TIMELINE
              </span>

              <h2>
                Move Status
              </h2>

            </div>

            <span className="track-timeline-note">
              Status updates automatically
            </span>

          </div>


          <div className="track-timeline">

            {statusSteps.map(
              (
                step,
                index
              ) => {

                const state =
                  getStepState(
                    index
                  );

                return (

                  <div
                    className={`track-timeline-item ${state}`}
                    key={step.key}
                  >

                    <div className="track-timeline-left">

                      <div className="track-timeline-icon">

                        {state ===
                        "completed"
                          ? "✓"
                          : step.icon}

                      </div>


                      {index !==
                        statusSteps.length -
                          1 && (

                        <div className="track-timeline-connector">

                          <div
                            className={
                              index <
                              currentStepIndex
                                ? "filled"
                                : ""
                            }
                          ></div>

                        </div>

                      )}

                    </div>


                    <div className="track-timeline-content">

                      <div className="track-timeline-title-row">

                        <h3>
                          {step.title}
                        </h3>


                        {state ===
                          "current" && (

                          <span className="track-current-tag">
                            CURRENT
                          </span>

                        )}


                        {state ===
                          "completed" && (

                          <span className="track-completed-tag">
                            COMPLETED
                          </span>

                        )}

                      </div>


                      <p>
                        {step.description}
                      </p>


                      {state ===
                        "current" && (

                        <div className="track-live-update">

                          <span className="track-live-dot"></span>

                          Waiting for the next status update...

                        </div>

                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* ==========================================
            REAL-TIME INFORMATION
        ========================================== */}

        <section className="track-realtime-card">

          <div className="track-realtime-icon">
            ⚡
          </div>


          <div className="track-realtime-content">

            <h3>
              Real-Time Move Updates
            </h3>

            <p>
              Your tracking status updates automatically
              whenever the driver changes the booking status.
            </p>

            {lastUpdated && (

              <small>
                Last updated at{" "}
                {lastUpdated.toLocaleTimeString(
                  "en-IN",
                  {
                    hour:
                      "2-digit",
                    minute:
                      "2-digit",
                    second:
                      "2-digit",
                  }
                )}
              </small>

            )}

          </div>


          <div
            className={`track-connection-status ${
              socketConnected
                ? "connected"
                : "disconnected"
            }`}
          >

            <span></span>

            {socketConnected
              ? "Live Connected"
              : "Connecting..."}

          </div>

        </section>


        {/* ==========================================
            ACTION BUTTONS
        ========================================== */}

        <section className="track-actions">

          <button
            className="track-secondary-button"
            onClick={
              handleBackDashboard
            }
          >
            ← Back to Dashboard
          </button>


          <button
            className="track-primary-button"
            onClick={
              handleViewBooking
            }
          >
            View Booking Details →
          </button>

        </section>


        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="track-footer">

          <p>
            © 2026 Move-Home. Digital Relocation Management System.
          </p>

          <div>

            <span>
              Secure
            </span>

            <span>
              •
            </span>

            <span>
              Reliable
            </span>

            <span>
              •
            </span>

            <span>
              Real-Time Tracking
            </span>

          </div>

        </footer>

      </main>

    </div>

  );
};

export default TrackMyMove;