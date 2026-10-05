import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DriverSidebar from "../components/DriverSidebar";
import API from "../services/api";
import "./DriverDashboard.css";

const DriverDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ====================================================
  LOAD DRIVER BOOKINGS FROM BACKEND
  ====================================================
  */

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/driver-login");
        return;
      }

      const response = await API.get(
        "/bookings/driver",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        console.error(
          response.data.message ||
            "Unable to load driver bookings."
        );

        setBookings([]);
        return;
      }

      setBookings(
        response.data.bookings || []
      );

    } catch (error) {
      console.error(
        "Unable to load driver bookings:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/driver-login");
        return;
      }

      setBookings([]);

    } finally {
      setLoading(false);
    }
  };

  /*
  ====================================================
  INITIAL LOAD
  ====================================================
  */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser =
      localStorage.getItem("user");

    if (!token) {
      navigate("/driver-login");
      return;
    }

    let parsedUser = null;

    try {
      parsedUser = savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      parsedUser = null;
    }

    /*
      Driver dashboard should only be
      accessible to driver accounts.
    */

    if (
      !parsedUser ||
      parsedUser.role?.toLowerCase() !== "driver"
    ) {
      navigate("/driver-login");
      return;
    }

    setUser(parsedUser);

    loadBookings();
  }, [navigate]);


  /*
  ====================================================
  STATUS LABEL
  ====================================================
  */

  const getStatusLabel = (status) => {
    if (!status) {
      return "Pending";
    }

    const statusMap = {
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
        "On The Way",

      ARRIVED:
        "Arrived",

      DELIVERED:
        "Delivered",

      CANCELLED:
        "Cancelled",
    };

    return (
      statusMap[status] ||
      status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        )
    );
  };


  /*
  ====================================================
  STATUS CSS CLASS
  ====================================================
  */

  const getStatusClass = (status) => {
    switch (status) {
      case "BOOKING_CONFIRMED":
        return "driver-status-confirmed";

      case "DRIVER_ASSIGNED":
        return "driver-status-assigned";

      case "PICKUP_SCHEDULED":
        return "driver-status-scheduled";

      case "ITEMS_LOADING":
      case "ITEMS_LOADED":
        return "driver-status-loading";

      case "ON_THE_WAY":
      case "ARRIVED":
        return "driver-status-active";

      case "DELIVERED":
        return "driver-status-delivered";

      case "CANCELLED":
        return "driver-status-cancelled";

      default:
        return "driver-status-default";
    }
  };


  /*
  ====================================================
  GET MOVING ITEMS
  ====================================================
  */

  const getMoveItems = (booking) => {
    return (
      booking?.movingItems ||
      booking?.items ||
      []
    );
  };


  /*
  ====================================================
  GET ITEM COUNT
  ====================================================
  */

  const getItemCount = (booking) => {
    const items = getMoveItems(booking);

    return items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  };


  /*
  ====================================================
  PROPERTY TYPE
  ====================================================
  */

  const getPropertyType = (booking) => {
    const propertyType =
      booking?.moveRequest?.propertyType ||
      booking?.propertyType ||
      "Home";

    return propertyType
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };


  /*
  ====================================================
  FORMAT DATE
  ====================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "Not scheduled";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not scheduled";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /*
  ====================================================
  FORMAT PRICE
  ====================================================
  */

  const formatPrice = (price) => {
    const amount =
      Number(price || 0);

    return amount.toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
  };


  /*
  ====================================================
  GET TOTAL PRICE
  ====================================================
  */

  const getTotal = (booking) => {
    return (
      booking?.priceEstimate?.total ||
      booking?.priceEstimate?.totalEstimate ||
      booking?.priceEstimate?.estimatedTotal ||
      0
    );
  };


  /*
  ====================================================
  GET PICKUP LOCATION
  ====================================================
  */

  const getPickup = (booking) => {
    return (
      booking?.moveRequest
        ?.pickupAddress ||
      booking?.moveRequest
        ?.pickupLocation ||
      booking?.pickupAddress ||
      "Pickup location"
    );
  };


  /*
  ====================================================
  GET DESTINATION
  ====================================================
  */

  const getDestination = (booking) => {
    return (
      booking?.moveRequest
        ?.destinationAddress ||
      booking?.moveRequest
        ?.destinationLocation ||
      booking?.destinationAddress ||
      "Destination"
    );
  };


  /*
  ====================================================
  GET VEHICLE
  ====================================================
  */

  const getVehicle = (booking) => {
    return (
      booking?.vehicle?.name ||
      booking?.selectedVehicle?.name ||
      "Vehicle not assigned"
    );
  };


  /*
  ====================================================
  BOOKING FILTERS
  ====================================================
  */

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status !==
          "DELIVERED" &&
        booking.status !==
          "CANCELLED"
    );


  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "DELIVERED"
    );


  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
          "BOOKING_CONFIRMED" ||
        booking.status ===
          "DRIVER_ASSIGNED" ||
        booking.status ===
          "PICKUP_SCHEDULED"
    );


  /*
  ====================================================
  VIEW MOVE DETAILS
  ====================================================
  */

  const handleViewMove = (booking) => {
    localStorage.setItem(
      "driverSelectedBooking",
      JSON.stringify(booking)
    );

    navigate(
      "/driver-move-details"
    );
  };


  /*
  ====================================================
  UPDATE STATUS
  ====================================================
  */

  const handleUpdateStatus = (
    booking
  ) => {
    localStorage.setItem(
      "driverSelectedBooking",
      JSON.stringify(booking)
    );

    navigate(
      "/driver-update-status"
    );
  };


  /*
  ====================================================
  GET FIRST NAME
  ====================================================
  */

  const getFirstName = () => {
    if (!user?.name) {
      return "Driver";
    }

    return user.name
      .trim()
      .split(" ")[0];
  };


  /*
  ====================================================
  LOADING SCREEN
  ====================================================
  */

  if (loading) {
    return (
      <div className="driver-dashboard-page">

        <DriverSidebar />

        <main className="driver-dashboard-main">

          <section className="driver-dashboard-content">

            <div
              className="driver-empty-state"
              style={{
                marginTop: "100px",
              }}
            >

              <div className="driver-empty-icon">
                ⏳
              </div>

              <h4>
                Loading your moves...
              </h4>

              <p>
                Please wait while we
                fetch your assigned
                bookings.
              </p>

            </div>

          </section>

        </main>

      </div>
    );
  }


  /*
  ====================================================
  MAIN UI
  ====================================================
  */

  return (
    <div className="driver-dashboard-page">

      <DriverSidebar />


      <main className="driver-dashboard-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="driver-dashboard-topbar">

          <div>

            <p className="driver-dashboard-label">
              Driver Panel
            </p>

            <h1 className="driver-dashboard-title">
              Driver Dashboard
            </h1>

          </div>


          <div className="driver-dashboard-user">

            <div className="driver-dashboard-avatar">

              {user?.name
                ? user.name
                    .split(" ")
                    .map(
                      (part) =>
                        part.charAt(0)
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "DR"}

            </div>


            <div className="driver-dashboard-user-info">

              <strong>
                {user?.name ||
                  "Driver"}
              </strong>

              <span>
                Driver
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="driver-dashboard-content">


          {/* =================================================
              WELCOME CARD
          ================================================= */}

          <div className="driver-welcome-card">

            <div className="driver-welcome-content">

              <p className="driver-welcome-small">
                Welcome back 👋
              </p>

              <h2>
                Hello, {getFirstName()}!
              </h2>

              <p>
                Manage your assigned
                relocation jobs, update
                move statuses, and keep
                customers informed
                throughout their journey.
              </p>


              <button
                className="driver-welcome-button"
                onClick={() =>
                  navigate(
                    "/driver-assigned-moves"
                  )
                }
              >
                View Assigned Moves

                <span>
                  →
                </span>

              </button>

            </div>


            <div className="driver-welcome-illustration">
              🚚
            </div>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="driver-stats-grid">


            <div className="driver-stat-card">

              <div className="driver-stat-icon blue">
                📋
              </div>

              <div className="driver-stat-info">

                <span>
                  Total Moves
                </span>

                <strong>
                  {bookings.length}
                </strong>

              </div>

            </div>


            <div className="driver-stat-card">

              <div className="driver-stat-icon orange">
                🚚
              </div>

              <div className="driver-stat-info">

                <span>
                  Active Moves
                </span>

                <strong>
                  {activeBookings.length}
                </strong>

              </div>

            </div>


            <div className="driver-stat-card">

              <div className="driver-stat-icon green">
                ✓
              </div>

              <div className="driver-stat-info">

                <span>
                  Completed
                </span>

                <strong>
                  {completedBookings.length}
                </strong>

              </div>

            </div>


            <div className="driver-stat-card">

              <div className="driver-stat-icon purple">
                ⏳
              </div>

              <div className="driver-stat-info">

                <span>
                  Pending
                </span>

                <strong>
                  {pendingBookings.length}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="driver-dashboard-grid">


            {/* =================================================
                ASSIGNED MOVES
            ================================================= */}

            <div className="driver-dashboard-card driver-moves-card">

              <div className="driver-card-header">

                <div>

                  <h3>
                    Assigned Moves
                  </h3>

                  <p>
                    Your latest relocation
                    assignments
                  </p>

                </div>


                <button
                  className="driver-view-all-button"
                  onClick={() =>
                    navigate(
                      "/driver-assigned-moves"
                    )
                  }
                >
                  View All

                  <span>
                    →
                  </span>

                </button>

              </div>


              {bookings.length === 0 ? (

                <div className="driver-empty-state">

                  <div className="driver-empty-icon">
                    📋
                  </div>

                  <h4>
                    No moves assigned
                  </h4>

                  <p>
                    New relocation
                    assignments will appear
                    here.
                  </p>

                </div>

              ) : (

                <div className="driver-move-list">

                  {bookings
                    .slice(0, 4)
                    .map(
                      (
                        booking,
                        index
                      ) => (

                        <div
                          className="driver-move-row"
                          key={
                            booking.bookingId ||
                            booking._id ||
                            index
                          }
                        >


                          <div className="driver-move-number">
                            {index + 1}
                          </div>


                          <div className="driver-move-main">

                            <div className="driver-move-top">

                              <strong>
                                {booking.bookingId ||
                                  `MH-${index + 1}`}
                              </strong>


                              <span
                                className={`driver-status ${getStatusClass(
                                  booking.status
                                )}`}
                              >
                                {getStatusLabel(
                                  booking.status
                                )}
                              </span>

                            </div>


                            <div className="driver-route">

                              <div className="driver-route-point">

                                <span className="pickup-dot"></span>

                                <span>
                                  {getPickup(
                                    booking
                                  )}
                                </span>

                              </div>


                              <div className="driver-route-line"></div>


                              <div className="driver-route-point">

                                <span className="destination-dot"></span>

                                <span>
                                  {getDestination(
                                    booking
                                  )}
                                </span>

                              </div>

                            </div>


                            <div className="driver-move-meta">

                              <span>
                                📅{" "}
                                {formatDate(
                                  booking
                                    ?.moveRequest
                                    ?.movingDate
                                )}
                              </span>


                              <span>
                                🚛{" "}
                                {getVehicle(
                                  booking
                                )}
                              </span>


                              <span>
                                📦{" "}
                                {getItemCount(
                                  booking
                                )} items
                              </span>

                            </div>

                          </div>


                          <div className="driver-move-actions">

                            <button
                              className="driver-details-button"
                              onClick={() =>
                                handleViewMove(
                                  booking
                                )
                              }
                            >
                              Details
                            </button>


                            {booking.status !==
                              "DELIVERED" &&
                              booking.status !==
                                "CANCELLED" && (

                                <button
                                  className="driver-update-button"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      booking
                                    )
                                  }
                                >
                                  Update
                                </button>

                              )}

                          </div>

                        </div>

                      )
                    )}

                </div>

              )}

            </div>


            {/* =================================================
                TODAY'S SUMMARY
            ================================================= */}

            <div className="driver-dashboard-card driver-summary-card">

              <div className="driver-card-header">

                <div>

                  <h3>
                    Today's Summary
                  </h3>

                  <p>
                    Your current workload
                  </p>

                </div>

              </div>


              <div className="driver-summary-content">


                <div className="driver-summary-item">

                  <div className="driver-summary-icon">
                    🚚
                  </div>

                  <div>

                    <span>
                      Active Moves
                    </span>

                    <strong>
                      {activeBookings.length}
                    </strong>

                  </div>

                </div>


                <div className="driver-summary-divider"></div>


                <div className="driver-summary-item">

                  <div className="driver-summary-icon">
                    📦
                  </div>

                  <div>

                    <span>
                      Total Items
                    </span>

                    <strong>
                      {bookings.reduce(
                        (
                          total,
                          booking
                        ) =>
                          total +
                          getItemCount(
                            booking
                          ),
                        0
                      )}
                    </strong>

                  </div>

                </div>


                <div className="driver-summary-divider"></div>


                <div className="driver-summary-item">

                  <div className="driver-summary-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      Completed Jobs
                    </span>

                    <strong>
                      {
                        completedBookings.length
                      }
                    </strong>

                  </div>

                </div>

              </div>


              <div className="driver-summary-note">

                <span>
                  💡
                </span>

                <p>
                  Keep move statuses updated
                  so customers can track their
                  relocation in real time.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="driver-dashboard-card driver-quick-card">

            <div className="driver-card-header">

              <div>

                <h3>
                  Quick Actions
                </h3>

                <p>
                  Common driver operations
                </p>

              </div>

            </div>


            <div className="driver-quick-grid">


              <button
                className="driver-quick-action"
                onClick={() =>
                  navigate(
                    "/driver-assigned-moves"
                  )
                }
              >

                <div className="driver-quick-icon">
                  📋
                </div>

                <div>

                  <strong>
                    Assigned Moves
                  </strong>

                  <span>
                    View all assigned jobs
                  </span>

                </div>

                <b>
                  →
                </b>

              </button>


              <button
                className="driver-quick-action"
                onClick={() =>
                  navigate(
                    "/driver-completed-jobs"
                  )
                }
              >

                <div className="driver-quick-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Completed Jobs
                  </strong>

                  <span>
                    View delivered moves
                  </span>

                </div>

                <b>
                  →
                </b>

              </button>


              <button
                className="driver-quick-action"
                onClick={() =>
                  navigate(
                    "/driver-profile"
                  )
                }
              >

                <div className="driver-quick-icon">
                  👤
                </div>

                <div>

                  <strong>
                    Driver Profile
                  </strong>

                  <span>
                    Manage your driver account
                  </span>

                </div>

                <b>
                  →
                </b>

              </button>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="driver-dashboard-footer">

            <div>

              <strong>
                Move-Home
              </strong>

              <span>
                Digital Relocation Management
              </span>

            </div>

            <p>
              Driver Panel • Manage moves efficiently
            </p>

          </footer>

        </section>

      </main>

    </div>
  );
};

export default DriverDashboard;