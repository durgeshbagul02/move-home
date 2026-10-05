import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DriverSidebar from "../components/DriverSidebar";
import API from "../services/api";

import "./DriverMoveDetails.css";

const DriverMoveDetails = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/driver-login");
        return;
      }

      const savedBooking = localStorage.getItem(
        "driverSelectedBooking"
      );

      if (!savedBooking) {
        setError("No booking selected.");
        return;
      }

      let selectedBooking;

      try {
        selectedBooking = JSON.parse(savedBooking);
      } catch (parseError) {
        console.error(
          "Selected booking JSON error:",
          parseError
        );

        setError("Invalid booking information.");
        return;
      }

      if (!selectedBooking?._id) {
        setError("Invalid booking information.");
        return;
      }

      const response = await API.get(
        `/bookings/${selectedBooking._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response?.data?.success) {
        setError(
          response?.data?.message ||
            "Unable to load booking details."
        );
        return;
      }

      if (!response?.data?.booking) {
        setError("Booking details were not found.");
        return;
      }

      setBooking(response.data.booking);
    } catch (err) {
      console.error(
        "Driver move details error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(
          "driverSelectedBooking"
        );

        navigate("/driver-login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load booking details."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const getStatusLabel = (status) => {
    const statusMap = {
      BOOKING_CONFIRMED: "Booking Confirmed",
      DRIVER_ASSIGNED: "Driver Assigned",
      PICKUP_SCHEDULED: "Pickup Scheduled",
      ITEMS_LOADING: "Items Loading",
      ITEMS_LOADED: "Items Loaded",
      ON_THE_WAY: "On The Way",
      ARRIVED: "Arrived",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };

    return statusMap[status] || status || "Unknown";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "BOOKING_CONFIRMED":
        return "move-details-status-confirmed";

      case "DRIVER_ASSIGNED":
        return "move-details-status-assigned";

      case "PICKUP_SCHEDULED":
        return "move-details-status-scheduled";

      case "ITEMS_LOADING":
      case "ITEMS_LOADED":
        return "move-details-status-loading";

      case "ON_THE_WAY":
      case "ARRIVED":
        return "move-details-status-active";

      case "DELIVERED":
        return "move-details-status-delivered";

      case "CANCELLED":
        return "move-details-status-cancelled";

      default:
        return "move-details-status-default";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not scheduled";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not scheduled";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
  };

  const getPickupAddress = () => {
    return (
      booking?.moveRequest?.pickupAddress ||
      booking?.moveRequest?.pickupLocation ||
      booking?.moveRequest?.pickup ||
      "Not available"
    );
  };

  const getDestinationAddress = () => {
    return (
      booking?.moveRequest?.destinationAddress ||
      booking?.moveRequest?.dropLocation ||
      booking?.moveRequest?.destination ||
      "Not available"
    );
  };

  const getMovingDate = () => {
    return (
      booking?.moveRequest?.movingDate ||
      booking?.movingDate ||
      null
    );
  };

  const getPropertyType = () => {
    return (
      booking?.moveRequest?.propertyType ||
      "Not specified"
    );
  };

  const getVehicleName = () => {
    return (
      booking?.selectedVehicle?.name ||
      "Not specified"
    );
  };

  const getVehicleCapacity = () => {
    return (
      booking?.selectedVehicle?.capacity ||
      "Not specified"
    );
  };

  const getTotalPrice = () => {
    return (
      booking?.priceEstimate?.totalEstimate ||
      booking?.priceEstimate?.total ||
      0
    );
  };

  const getItemCount = () => {
    const items = Array.isArray(
      booking?.movingItems
    )
      ? booking.movingItems
      : [];

    return items.reduce(
      (total, item) =>
        total + Number(item?.quantity || 0),
      0
    );
  };

  const handleUpdateStatus = () => {
    if (!booking?._id) {
      return;
    }

    localStorage.setItem(
      "driverSelectedBooking",
      JSON.stringify(booking)
    );

    navigate("/driver-update-status");
  };

  const handleBack = () => {
    navigate("/driver-assigned-moves");
  };

  if (loading) {
    return (
      <div className="driver-move-details-page">
        <DriverSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="driver-move-details-main">
          <div className="move-details-loading">
            <div className="move-details-loading-icon">
              ⏳
            </div>

            <h3>Loading move details...</h3>

            <p>
              Fetching the latest booking information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="driver-move-details-page">
        <DriverSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="driver-move-details-main">
          <div className="move-details-error">
            <div className="move-details-error-icon">
              ⚠️
            </div>

            <h3>
              Unable to load move
            </h3>

            <p>
              {error || "Booking not found."}
            </p>

            <button onClick={handleBack}>
              ← Back to Assigned Moves
            </button>
          </div>
        </main>
      </div>
    );
  }

  const movingItems = Array.isArray(
    booking.movingItems
  )
    ? booking.movingItems
    : [];

  return (
    <div className="driver-move-details-page">
      <DriverSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="driver-move-details-main">

        {/* HEADER */}

        <header className="move-details-topbar">

          <button
            className="driver-mobile-menu-btn"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open menu"
          >
            ☰
          </button>

          <div>
            <p className="move-details-label">
              DRIVER PANEL
            </p>

            <h1>
              Move Details
            </h1>

            <p className="move-details-subtitle">
              Complete information about this
              relocation booking.
            </p>
          </div>

          <button
            className="move-details-back-btn"
            onClick={handleBack}
          >
            ← Assigned Moves
          </button>

        </header>


        {/* CONTENT */}

        <section className="move-details-content">

          {/* BOOKING HEADER */}

          <div className="move-details-booking-header">

            <div>
              <span>
                BOOKING ID
              </span>

              <h2>
                {booking.bookingId ||
                  "Booking"}
              </h2>

              <p>
                Created{" "}
                {formatDate(
                  booking.createdAt
                )}
              </p>
            </div>

            <span
              className={`move-details-status ${getStatusClass(
                booking.status
              )}`}
            >
              {getStatusLabel(
                booking.status
              )}
            </span>

          </div>


          {/* CUSTOMER */}

          <div className="move-details-card">

            <div className="move-details-card-header">

              <div className="move-details-card-icon">
                👤
              </div>

              <div>
                <h3>
                  Customer Information
                </h3>

                <p>
                  Customer details for this move
                </p>
              </div>

            </div>

            <div className="customer-details-grid">

              <div>
                <span>Name</span>

                <strong>
                  {booking.customer?.name ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>
                  {booking.customer?.phone ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {booking.customer?.email ||
                    "Not available"}
                </strong>
              </div>

            </div>

          </div>


          {/* ROUTE */}

          <div className="move-details-card">

            <div className="move-details-card-header">

              <div className="move-details-card-icon">
                📍
              </div>

              <div>
                <h3>
                  Relocation Route
                </h3>

                <p>
                  Pickup and destination details
                </p>
              </div>

            </div>

            <div className="move-route-details">

              <div className="move-route-location">

                <div className="route-dot pickup-dot-large">
                  ●
                </div>

                <div>
                  <span>
                    PICKUP LOCATION
                  </span>

                  <strong>
                    {getPickupAddress()}
                  </strong>
                </div>

              </div>

              <div className="move-route-connector"></div>

              <div className="move-route-location">

                <div className="route-dot destination-dot-large">
                  ●
                </div>

                <div>
                  <span>
                    DESTINATION
                  </span>

                  <strong>
                    {getDestinationAddress()}
                  </strong>
                </div>

              </div>

            </div>

          </div>


          {/* MOVE INFORMATION */}

          <div className="move-details-card">

            <div className="move-details-card-header">

              <div className="move-details-card-icon">
                📋
              </div>

              <div>
                <h3>
                  Move Information
                </h3>

                <p>
                  Schedule and property details
                </p>
              </div>

            </div>

            <div className="move-info-grid">

              <div>
                <span>Moving Date</span>

                <strong>
                  {formatDate(
                    getMovingDate()
                  )}
                </strong>
              </div>

              <div>
                <span>Property Type</span>

                <strong>
                  {getPropertyType()}
                </strong>
              </div>

              <div>
                <span>Vehicle</span>

                <strong>
                  {getVehicleName()}
                </strong>
              </div>

              <div>
                <span>Capacity</span>

                <strong>
                  {getVehicleCapacity()}
                </strong>
              </div>

              <div>
                <span>Total Items</span>

                <strong>
                  {getItemCount()} items
                </strong>
              </div>

            </div>

          </div>


          {/* ITEMS */}

          <div className="move-details-card">

            <div className="move-details-card-header">

              <div className="move-details-card-icon">
                📦
              </div>

              <div>
                <h3>
                  Moving Items
                </h3>

                <p>
                  Items included in this relocation
                </p>
              </div>

            </div>

            {movingItems.length === 0 ? (
              <div className="move-items-empty">
                <span>📦</span>

                <p>
                  No moving items found.
                </p>
              </div>
            ) : (
              <div className="move-items-table">

                <div className="move-items-table-head">
                  <span>Item</span>
                  <span>Quantity</span>
                  <span>Type</span>
                </div>

                {movingItems.map(
                  (item, index) => (
                    <div
                      className="move-items-table-row"
                      key={
                        item._id ||
                        `${item.name}-${index}`
                      }
                    >

                      <strong>
                        {item.name ||
                          "Unnamed Item"}
                      </strong>

                      <span>
                        {Number(
                          item.quantity || 0
                        )}
                      </span>

                      <span
                        className={
                          item.fragile
                            ? "fragile-badge"
                            : "normal-badge"
                        }
                      >
                        {item.fragile
                          ? "Fragile"
                          : "Normal"}
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

          </div>


          {/* FARE */}

          <div className="move-details-card">

            <div className="move-details-card-header">

              <div className="move-details-card-icon">
                💰
              </div>

              <div>
                <h3>
                  Fare & Payment
                </h3>

                <p>
                  Estimated booking charges
                </p>
              </div>

            </div>

            <div className="fare-details">

              <div>
                <span>
                  Distance Charge
                </span>

                <strong>
                  {formatPrice(
                    booking.priceEstimate
                      ?.distanceCharge
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Vehicle Charge
                </span>

                <strong>
                  {formatPrice(
                    booking.priceEstimate
                      ?.vehicleCharge
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Item Handling
                </span>

                <strong>
                  {formatPrice(
                    booking.priceEstimate
                      ?.itemHandlingCharge
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Fragile Handling
                </span>

                <strong>
                  {formatPrice(
                    booking.priceEstimate
                      ?.fragileHandlingCharge
                  )}
                </strong>
              </div>

              {booking.priceEstimate
                ?.serviceCharge > 0 && (
                <div>
                  <span>
                    Service Charge
                  </span>

                  <strong>
                    {formatPrice(
                      booking.priceEstimate
                        .serviceCharge
                    )}
                  </strong>
                </div>
              )}

              <div className="fare-total">

                <span>
                  Estimated Total
                </span>

                <strong>
                  {formatPrice(
                    getTotalPrice()
                  )}
                </strong>

              </div>

            </div>

            <div className="payment-status-row">

              <span>
                Payment Status
              </span>

              <strong>
                {booking.paymentStatus ||
                  "PENDING"}
              </strong>

            </div>

          </div>


          {/* NOTES */}

          {booking.notes && (
            <div className="move-details-card">

              <div className="move-details-card-header">

                <div className="move-details-card-icon">
                  📝
                </div>

                <div>
                  <h3>
                    Customer Notes
                  </h3>

                  <p>
                    Additional instructions from
                    the customer
                  </p>
                </div>

              </div>

              <p className="customer-notes">
                {booking.notes}
              </p>

            </div>
          )}


          {/* ACTIONS */}

          {booking.status !== "DELIVERED" &&
            booking.status !== "CANCELLED" && (
              <div className="move-details-actions">

                <button
                  className="move-details-update-btn"
                  onClick={
                    handleUpdateStatus
                  }
                >
                  Update Move Status →
                </button>

              </div>
            )}

        </section>

      </main>
    </div>
  );
};

export default DriverMoveDetails;