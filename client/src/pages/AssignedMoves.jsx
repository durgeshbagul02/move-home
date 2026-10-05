import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DriverSidebar from "../components/DriverSidebar";
import API from "../services/api";
import "./AssignedMoves.css";

const AssignedMoves = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignedMoves = async () => {
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
        setError(
          response.data.message ||
            "Unable to load assigned moves."
        );

        return;
      }

      setBookings(
        response.data.bookings || []
      );

    } catch (err) {
      console.error(
        "Assigned moves error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/driver-login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load assigned moves."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedMoves();
  }, [navigate]);

  const getStatusLabel = (status) => {
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
      "Unknown Status"
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "BOOKING_CONFIRMED":
        return "assigned-status-confirmed";

      case "DRIVER_ASSIGNED":
        return "assigned-status-assigned";

      case "PICKUP_SCHEDULED":
        return "assigned-status-scheduled";

      case "ITEMS_LOADING":
      case "ITEMS_LOADED":
        return "assigned-status-loading";

      case "ON_THE_WAY":
      case "ARRIVED":
        return "assigned-status-active";

      case "DELIVERED":
        return "assigned-status-delivered";

      case "CANCELLED":
        return "assigned-status-cancelled";

      default:
        return "assigned-status-default";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not scheduled";
    }

    const parsedDate = new Date(date);

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

  const formatPrice = (booking) => {
    const price =
      booking?.priceEstimate?.totalEstimate ||
      booking?.priceEstimate?.total ||
      0;

    return Number(price).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
  };

  const getItemCount = (booking) => {
    const items =
      booking?.movingItems || [];

    return items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  };

  const handleViewDetails = (booking) => {
    localStorage.setItem(
      "driverSelectedBooking",
      JSON.stringify(booking)
    );

    navigate(
      "/driver-move-details"
    );
  };

  const handleUpdateStatus = (booking) => {
    localStorage.setItem(
      "driverSelectedBooking",
      JSON.stringify(booking)
    );

    navigate(
      "/driver-update-status"
    );
  };

  return (
    <div className="assigned-moves-page">

      <DriverSidebar />

      <main className="assigned-moves-main">

        {/* TOPBAR */}

        <header className="assigned-moves-topbar">

          <div>
            <p className="assigned-page-label">
              DRIVER PANEL
            </p>

            <h1>
              Assigned Moves
            </h1>

            <p className="assigned-page-subtitle">
              View and manage all relocation
              bookings assigned to you.
            </p>
          </div>

          <button
            className="assigned-dashboard-btn"
            onClick={() =>
              navigate(
                "/driver-dashboard"
              )
            }
          >
            ← Dashboard
          </button>

        </header>


        {/* CONTENT */}

        <section className="assigned-moves-content">

          {/* SUMMARY */}

          <div className="assigned-summary-grid">

            <div className="assigned-summary-card">

              <div className="assigned-summary-icon blue">
                📋
              </div>

              <div>
                <span>
                  Total Assigned
                </span>

                <strong>
                  {bookings.length}
                </strong>
              </div>

            </div>


            <div className="assigned-summary-card">

              <div className="assigned-summary-icon orange">
                🚚
              </div>

              <div>
                <span>
                  Active
                </span>

                <strong>
                  {
                    bookings.filter(
                      (booking) =>
                        booking.status !==
                          "DELIVERED" &&
                        booking.status !==
                          "CANCELLED"
                    ).length
                  }
                </strong>
              </div>

            </div>


            <div className="assigned-summary-card">

              <div className="assigned-summary-icon green">
                ✓
              </div>

              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {
                    bookings.filter(
                      (booking) =>
                        booking.status ===
                        "DELIVERED"
                    ).length
                  }
                </strong>
              </div>

            </div>


            <div className="assigned-summary-card">

              <div className="assigned-summary-icon purple">
                📦
              </div>

              <div>
                <span>
                  Total Items
                </span>

                <strong>
                  {bookings.reduce(
                    (total, booking) =>
                      total +
                      getItemCount(
                        booking
                      ),
                    0
                  )}
                </strong>
              </div>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="assigned-error">
              ⚠ {error}
            </div>

          )}


          {/* LOADING */}

          {loading ? (

            <div className="assigned-empty-card">

              <div className="assigned-loading-icon">
                ⏳
              </div>

              <h3>
                Loading assigned moves...
              </h3>

              <p>
                Fetching your latest
                relocation assignments.
              </p>

            </div>

          ) : bookings.length === 0 ? (

            /* EMPTY */

            <div className="assigned-empty-card">

              <div className="assigned-empty-icon">
                📋
              </div>

              <h3>
                No Assigned Moves
              </h3>

              <p>
                You don't have any relocation
                bookings assigned to you yet.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/driver-dashboard"
                  )
                }
              >
                Back to Dashboard
              </button>

            </div>

          ) : (

            /* BOOKING LIST */

            <div className="assigned-bookings-section">

              <div className="assigned-section-header">

                <div>
                  <h2>
                    Your Assignments
                  </h2>

                  <p>
                    {bookings.length} relocation
                    {bookings.length !== 1
                      ? "s"
                      : ""} assigned to you
                  </p>
                </div>

              </div>


              <div className="assigned-bookings-list">

                {bookings.map(
                  (booking) => (

                    <article
                      className="assigned-booking-card"
                      key={
                        booking._id ||
                        booking.bookingId
                      }
                    >

                      {/* CARD HEADER */}

                      <div className="assigned-card-header">

                        <div>

                          <span className="assigned-booking-label">
                            BOOKING ID
                          </span>

                          <h3>
                            {booking.bookingId}
                          </h3>

                        </div>

                        <span
                          className={`assigned-status ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {getStatusLabel(
                            booking.status
                          )}
                        </span>

                      </div>


                      {/* ROUTE */}

                      <div className="assigned-route">

                        <div className="assigned-route-item">

                          <div className="assigned-route-icon pickup">
                            ●
                          </div>

                          <div>

                            <span>
                              PICKUP
                            </span>

                            <strong>
                              {
                                booking
                                  ?.moveRequest
                                  ?.pickupAddress ||
                                "Pickup address unavailable"
                              }
                            </strong>

                          </div>

                        </div>


                        <div className="assigned-route-line"></div>


                        <div className="assigned-route-item">

                          <div className="assigned-route-icon destination">
                            ●
                          </div>

                          <div>

                            <span>
                              DESTINATION
                            </span>

                            <strong>
                              {
                                booking
                                  ?.moveRequest
                                  ?.destinationAddress ||
                                "Destination unavailable"
                              }
                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="assigned-details-grid">

                        <div className="assigned-detail">

                          <span>
                            📅 Moving Date
                          </span>

                          <strong>
                            {formatDate(
                              booking
                                ?.moveRequest
                                ?.movingDate
                            )}
                          </strong>

                        </div>


                        <div className="assigned-detail">

                          <span>
                            🏠 Property
                          </span>

                          <strong>
                            {
                              booking
                                ?.moveRequest
                                ?.propertyType ||
                              "Not specified"
                            }
                          </strong>

                        </div>


                        <div className="assigned-detail">

                          <span>
                            🚛 Vehicle
                          </span>

                          <strong>
                            {
                              booking
                                ?.selectedVehicle
                                ?.name ||
                              "Not specified"
                            }
                          </strong>

                        </div>


                        <div className="assigned-detail">

                          <span>
                            📦 Items
                          </span>

                          <strong>
                            {getItemCount(
                              booking
                            )}
                          </strong>

                        </div>


                        <div className="assigned-detail">

                          <span>
                            💰 Estimated Fare
                          </span>

                          <strong>
                            {formatPrice(
                              booking
                            )}
                          </strong>

                        </div>


                        <div className="assigned-detail">

                          <span>
                            💳 Payment
                          </span>

                          <strong>
                            {
                              booking.paymentStatus ||
                              "PENDING"
                            }
                          </strong>

                        </div>

                      </div>


                      {/* ITEMS */}

                      <div className="assigned-items">

                        <div className="assigned-items-title">
                          Moving Items
                        </div>

                        <div className="assigned-item-list">

                          {(
                            booking
                              .movingItems ||
                            []
                          ).map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                className="assigned-item"
                                key={index}
                              >

                                <span>
                                  📦
                                </span>

                                <strong>
                                  {item.name}
                                </strong>

                                <small>
                                  ×{" "}
                                  {item.quantity}
                                </small>

                                {item.fragile && (
                                  <em>
                                    Fragile
                                  </em>
                                )}

                              </div>

                            )
                          )}

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="assigned-card-actions">

                        <button
                          className="assigned-details-btn"
                          onClick={() =>
                            handleViewDetails(
                              booking
                            )
                          }
                        >
                          View Details
                        </button>

                        {booking.status !==
                          "DELIVERED" &&
                          booking.status !==
                            "CANCELLED" && (

                            <button
                              className="assigned-update-btn"
                              onClick={() =>
                                handleUpdateStatus(
                                  booking
                                )
                              }
                            >
                              Update Status
                            </button>

                          )}

                      </div>

                    </article>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default AssignedMoves;