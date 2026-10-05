import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import "./BookingHistory.css";

const BookingHistory = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      }
    }

    loadBookings(token);
  }, [navigate]);

  /* ========================= */
  /* LOAD BOOKINGS FROM MONGODB */
  /* ========================= */

  const loadBookings = async (token) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        setBookings([]);

        setError(
          response.data.message ||
            "Unable to load your bookings."
        );
      }
    } catch (error) {
      console.error(
        "Booking history API error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to load your bookings.";

      setError(message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* ========================= */
  /* STATUS */
  /* ========================= */

  const getStatusLabel = (status) => {
    const statusLabels = {
      BOOKING_CONFIRMED: "Booking Confirmed",
      DRIVER_ASSIGNED: "Driver Assigned",
      PICKUP_SCHEDULED: "Pickup Scheduled",
      ITEMS_LOADING: "Items Loading",
      ITEMS_LOADED: "Items Loaded",
      ON_THE_WAY: "On the Way",
      ARRIVED: "Arrived",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };

    return statusLabels[status] || "Booking Confirmed";
  };

  const getStatusClass = (status) => {
    if (status === "DELIVERED") {
      return "delivered";
    }

    if (status === "CANCELLED") {
      return "cancelled";
    }

    if (
      status === "ON_THE_WAY" ||
      status === "ARRIVED" ||
      status === "ITEMS_LOADING" ||
      status === "ITEMS_LOADED"
    ) {
      return "in-progress";
    }

    return "confirmed";
  };

  /* ========================= */
  /* DATE */
  /* ========================= */

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return date;
    }
  };

  /* ========================= */
  /* PRICE */
  /* ========================= */

  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  /* ========================= */
  /* PROPERTY TYPE */
  /* ========================= */

  const formatPropertyType = (propertyType) => {
    if (!propertyType) {
      return "Not specified";
    }

    return propertyType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  /* ========================= */
  /* ITEMS */
  /* ========================= */

  const getBookingItems = (booking) => {
    return booking.movingItems || booking.items || [];
  };

  const getItemCount = (booking) => {
    const items = getBookingItems(booking);

    return items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  /* ========================= */
  /* TOTAL AMOUNT */
  /* ========================= */

  const getTotalAmount = (booking) => {
    const priceEstimate =
      booking.priceEstimate || {};

    return (
      booking.total ||
      priceEstimate.total ||
      priceEstimate.totalEstimate ||
      priceEstimate.estimatedTotal ||
      0
    );
  };

  /* ========================= */
  /* VEHICLE */
  /* ========================= */

  const getVehicleName = (booking) => {
    return (
      booking.vehicle?.name ||
      booking.selectedVehicle?.name ||
      "Vehicle not specified"
    );
  };

  /* ========================= */
  /* PICKUP */
  /* ========================= */

  const getPickupLocation = (booking) => {
    return (
      booking.moveRequest?.pickupAddress ||
      booking.moveRequest?.pickupLocation ||
      "Pickup location not specified"
    );
  };

  /* ========================= */
  /* DESTINATION */
  /* ========================= */

  const getDestinationLocation = (booking) => {
    return (
      booking.moveRequest?.destinationAddress ||
      booking.moveRequest?.destinationLocation ||
      "Destination not specified"
    );
  };

  /* ========================= */
  /* VIEW DETAILS */
  /* ========================= */

  const handleViewDetails = (booking) => {
    /*
      Booking details page currently reads
      currentBooking from localStorage.

      The booking itself is coming from MongoDB/API.
      We temporarily store this selected MongoDB
      booking so the existing BookingDetails page
      continues working without changing its UI.
    */

    localStorage.setItem(
      "currentBooking",
      JSON.stringify(booking)
    );

    navigate("/booking-details");
  };

  /* ========================= */
  /* TRACK MOVE */
  /* ========================= */

  const handleTrackMove = (booking) => {
    /*
      Same compatibility approach for the current
      Track My Move page.
    */

    localStorage.setItem(
      "currentBooking",
      JSON.stringify(booking)
    );

    navigate("/track-move");
  };

  /* ========================= */
  /* CREATE MOVE */
  /* ========================= */

  const handleCreateMove = () => {
    navigate("/create-move");
  };

  /* ========================= */
  /* RETRY */
  /* ========================= */

  const handleRetry = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadBookings(token);
  };

  return (
    <div className="dashboard booking-history-page">

      <Sidebar />

      <main className="booking-history-main">

        {/* ========================= */}
        {/* TOPBAR */}
        {/* ========================= */}

        <header className="booking-history-topbar">

          <div>

            <p className="booking-history-breadcrumb">
              Move-Home / Bookings
            </p>

            <h1>
              Booking History
            </h1>

            <p className="booking-history-subtitle">
              View and manage all your relocation bookings.
            </p>

          </div>

          <div className="booking-history-user-area">

            <div className="booking-history-avatar">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}

            </div>

            <div className="booking-history-user-info">

              <strong>
                {user?.name || "Customer"}
              </strong>

              <span>
                Customer
              </span>

            </div>

          </div>

        </header>

        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}

        <section className="booking-history-summary">

          {/* TOTAL */}

          <div className="booking-summary-card">

            <div className="booking-summary-icon">
              📋
            </div>

            <div>

              <span>
                Total Bookings
              </span>

              <strong>
                {bookings.length}
              </strong>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="booking-summary-card">

            <div className="booking-summary-icon active-icon">
              🚚
            </div>

            <div>

              <span>
                Active Moves
              </span>

              <strong>
                {
                  bookings.filter(
                    (booking) =>
                      booking.status !== "DELIVERED" &&
                      booking.status !== "CANCELLED"
                  ).length
                }
              </strong>

            </div>

          </div>

          {/* COMPLETED */}

          <div className="booking-summary-card">

            <div className="booking-summary-icon completed-icon">
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
                      booking.status === "DELIVERED"
                  ).length
                }
              </strong>

            </div>

          </div>

          {/* CANCELLED */}

          <div className="booking-summary-card">

            <div className="booking-summary-icon cancelled-icon">
              !
            </div>

            <div>

              <span>
                Cancelled
              </span>

              <strong>
                {
                  bookings.filter(
                    (booking) =>
                      booking.status === "CANCELLED"
                  ).length
                }
              </strong>

            </div>

          </div>

        </section>

        {/* ========================= */}
        {/* PAGE HEADING */}
        {/* ========================= */}

        <section className="booking-history-heading">

          <div>

            <span className="booking-history-section-label">
              YOUR BOOKINGS
            </span>

            <h2>
              Relocation Requests
            </h2>

          </div>

          <button
            className="booking-history-create-button"
            onClick={handleCreateMove}
          >
            + New Moving Request
          </button>

        </section>

        {/* ========================= */}
        {/* LOADING */}
        {/* ========================= */}

        {loading ? (

          <section className="booking-history-empty">

            <div className="booking-history-empty-icon">
              📋
            </div>

            <h2>
              Loading Bookings...
            </h2>

            <p>
              Fetching your relocation bookings from Move-Home.
            </p>

          </section>

        ) : error ? (

          /* ========================= */
          /* ERROR */
          /* ========================= */

          <section className="booking-history-empty">

            <div className="booking-history-empty-icon">
              !
            </div>

            <h2>
              Unable to Load Bookings
            </h2>

            <p>
              {error}
            </p>

            <button
              className="booking-history-create-button"
              onClick={handleRetry}
            >
              Retry
            </button>

          </section>

        ) : bookings.length === 0 ? (

          /* ========================= */
          /* EMPTY STATE */
          /* ========================= */

          <section className="booking-history-empty">

            <div className="booking-history-empty-icon">
              📋
            </div>

            <h2>
              No Bookings Yet
            </h2>

            <p>
              You haven't created any moving requests yet.
              Start your relocation journey with Move-Home.
            </p>

            <button
              className="booking-history-create-button"
              onClick={handleCreateMove}
            >
              Create Your First Move
            </button>

          </section>

        ) : (

          /* ========================= */
          /* BOOKING LIST */
          /* ========================= */

          <section className="booking-history-list">

            {bookings.map((booking, index) => {

              const status =
                booking.status ||
                "BOOKING_CONFIRMED";

              const statusClass =
                getStatusClass(status);

              const bookingId =
                booking.bookingId ||
                booking._id ||
                `MH-${1000 + index}`;

              return (
                <article
                  className="booking-history-card"
                  key={`${bookingId}-${index}`}
                >

                  {/* ========================= */}
                  {/* CARD HEADER */}
                  {/* ========================= */}

                  <div className="booking-card-header">

                    <div className="booking-card-id-area">

                      <div className="booking-card-icon">
                        🚚
                      </div>

                      <div>

                        <span className="booking-card-label">
                          BOOKING ID
                        </span>

                        <h3>
                          {bookingId}
                        </h3>

                      </div>

                    </div>

                    <div
                      className={`booking-status-badge ${statusClass}`}
                    >

                      <span></span>

                      {getStatusLabel(status)}

                    </div>

                  </div>

                  {/* ========================= */}
                  {/* ROUTE */}
                  {/* ========================= */}

                  <div className="booking-card-route">

                    <div className="booking-location">

                      <div className="booking-location-icon pickup">
                        📦
                      </div>

                      <div>

                        <span>
                          FROM
                        </span>

                        <strong>
                          {getPickupLocation(booking)}
                        </strong>

                      </div>

                    </div>

                    <div className="booking-route-arrow">
                      →
                    </div>

                    <div className="booking-location">

                      <div className="booking-location-icon destination">
                        🏠
                      </div>

                      <div>

                        <span>
                          TO
                        </span>

                        <strong>
                          {getDestinationLocation(booking)}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* ========================= */}
                  {/* DETAILS */}
                  {/* ========================= */}

                  <div className="booking-card-details">

                    <div className="booking-detail">

                      <span>
                        Moving Date
                      </span>

                      <strong>
                        {formatDate(
                          booking.moveRequest?.movingDate
                        )}
                      </strong>

                    </div>

                    <div className="booking-detail">

                      <span>
                        Property Type
                      </span>

                      <strong>
                        {formatPropertyType(
                          booking.moveRequest?.propertyType
                        )}
                      </strong>

                    </div>

                    <div className="booking-detail">

                      <span>
                        Items
                      </span>

                      <strong>
                        {getItemCount(booking)} Items
                      </strong>

                    </div>

                    <div className="booking-detail">

                      <span>
                        Vehicle
                      </span>

                      <strong>
                        {getVehicleName(booking)}
                      </strong>

                    </div>

                    <div className="booking-detail price-detail">

                      <span>
                        Estimated Amount
                      </span>

                      <strong>
                        {formatPrice(
                          getTotalAmount(booking)
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* ========================= */}
                  {/* FOOTER */}
                  {/* ========================= */}

                  <div className="booking-card-footer">

                    <span className="booking-created-date">

                      Created{" "}

                      {formatDate(
                        booking.createdAt
                      )}

                    </span>

                    <div className="booking-card-actions">

                      {status !== "DELIVERED" &&
                        status !== "CANCELLED" && (

                          <button
                            className="booking-track-button"
                            onClick={() =>
                              handleTrackMove(booking)
                            }
                          >
                            Track Move
                          </button>

                        )}

                      <button
                        className="booking-details-button"
                        onClick={() =>
                          handleViewDetails(booking)
                        }
                      >
                        View Details →
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>

        )}

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}

        <footer className="booking-history-footer">

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
              Easy Relocation
            </span>

          </div>

        </footer>

      </main>

    </div>
  );
};

export default BookingHistory;