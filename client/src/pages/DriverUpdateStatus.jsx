import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DriverSidebar from "../components/DriverSidebar";
import API from "../services/api";

import "./DriverUpdateStatus.css";

const DriverUpdateStatus = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const statusOptions = [
    {
      value: "PICKUP_SCHEDULED",
      label: "Pickup Scheduled",
      description:
        "Pickup has been scheduled with the customer.",
      icon: "📅",
    },
    {
      value: "ITEMS_LOADING",
      label: "Items Loading",
      description:
        "Items are currently being loaded into the vehicle.",
      icon: "📦",
    },
    {
      value: "ITEMS_LOADED",
      label: "Items Loaded",
      description:
        "All moving items have been loaded.",
      icon: "✅",
    },
    {
      value: "ON_THE_WAY",
      label: "On The Way",
      description:
        "The vehicle is travelling to the destination.",
      icon: "🚚",
    },
    {
      value: "ARRIVED",
      label: "Arrived",
      description:
        "The vehicle has arrived at the destination.",
      icon: "📍",
    },
    {
      value: "DELIVERED",
      label: "Delivered",
      description:
        "The relocation has been successfully completed.",
      icon: "🏠",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      description:
        "Cancel this relocation booking.",
      icon: "❌",
    },
  ];

  const statusLabelMap = {
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

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/driver-login");
        return;
      }

      const savedBooking =
        localStorage.getItem(
          "driverSelectedBooking"
        );

      if (!savedBooking) {
        setError("No booking selected.");
        return;
      }

      let selectedBooking;

      try {
        selectedBooking =
          JSON.parse(savedBooking);
      } catch (parseError) {
        console.error(
          "Booking JSON parse error:",
          parseError
        );

        setError(
          "Invalid booking information."
        );

        return;
      }

      if (!selectedBooking?._id) {
        setError(
          "Invalid booking information."
        );

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
            "Unable to load booking."
        );

        return;
      }

      const latestBooking =
        response.data.booking;

      if (!latestBooking) {
        setError(
          "Booking details were not found."
        );

        return;
      }

      setBooking(latestBooking);

      setSelectedStatus(
        latestBooking.status || ""
      );
    } catch (err) {
      console.error(
        "Driver update status load error:",
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
          "Unable to load booking."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [navigate]);

  const getCurrentStatusLabel = () => {
    return (
      statusLabelMap[booking?.status] ||
      booking?.status ||
      "Unknown"
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
        month: "short",
        year: "numeric",
      }
    );
  };

  const handleStatusUpdate = async () => {
    if (!booking?._id) {
      return;
    }

    if (!selectedStatus) {
      setError(
        "Please select a status first."
      );

      return;
    }

    if (
      selectedStatus === booking.status
    ) {
      setError(
        "This booking is already at this status."
      );

      return;
    }

    const selectedOption =
      statusOptions.find(
        (option) =>
          option.value === selectedStatus
      );

    if (
      selectedStatus === "CANCELLED"
    ) {
      const confirmCancel =
        window.confirm(
          "Are you sure you want to cancel this booking?"
        );

      if (!confirmCancel) {
        return;
      }
    }

    if (
      selectedStatus === "DELIVERED"
    ) {
      const confirmDelivered =
        window.confirm(
          "Are you sure this relocation has been successfully delivered?"
        );

      if (!confirmDelivered) {
        return;
      }
    }

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/driver-login");
        return;
      }

      const response = await API.patch(
        `/bookings/${booking._id}/status`,
        {
          status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response?.data?.success) {
        setError(
          response?.data?.message ||
            "Unable to update booking status."
        );

        return;
      }

      const updatedBooking =
        response.data.booking;

      setBooking(updatedBooking);

      setSelectedStatus(
        updatedBooking.status
      );

      localStorage.setItem(
        "driverSelectedBooking",
        JSON.stringify(updatedBooking)
      );

      setSuccessMessage(
        `Move status updated to ${
          selectedOption?.label ||
          statusLabelMap[
            updatedBooking.status
          ] ||
          updatedBooking.status
        }.`
      );
    } catch (err) {
      console.error(
        "Driver status update error:",
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
          "Unable to update booking status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate("/driver-move-details");
  };

  const handleAssignedMoves = () => {
    navigate("/driver-assigned-moves");
  };

  if (loading) {
    return (
      <div className="driver-update-status-page">
        <DriverSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="driver-update-status-main">
          <div className="driver-update-loading">
            <div className="driver-update-loading-icon">
              ⏳
            </div>

            <h3>
              Loading booking...
            </h3>

            <p>
              Fetching the latest move information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="driver-update-status-page">
        <DriverSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="driver-update-status-main">
          <div className="driver-update-error">
            <div className="driver-update-error-icon">
              ⚠️
            </div>

            <h3>
              Unable to load booking
            </h3>

            <p>{error}</p>

            <button
              onClick={handleAssignedMoves}
            >
              ← Back to Assigned Moves
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="driver-update-status-page">
      <DriverSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="driver-update-status-main">

        {/* HEADER */}

        <header className="driver-update-topbar">

          <button
            className="driver-update-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            ☰
          </button>

          <div>
            <p className="driver-update-eyebrow">
              DRIVER PANEL
            </p>

            <h1>
              Update Move Status
            </h1>

            <p className="driver-update-subtitle">
              Update the customer about the
              current relocation progress.
            </p>
          </div>

          <button
            className="driver-update-back-btn"
            onClick={handleBack}
          >
            ← Move Details
          </button>

        </header>


        {/* CONTENT */}

        <section className="driver-update-content">

          {/* BOOKING SUMMARY */}

          <div className="driver-update-booking-card">

            <div className="driver-update-booking-main">

              <div className="driver-update-booking-icon">
                🚚
              </div>

              <div>
                <span>
                  BOOKING ID
                </span>

                <h2>
                  {booking?.bookingId ||
                    "Booking"}
                </h2>

                <p>
                  {getPickupAddress()}
                </p>

                <div className="driver-update-route-arrow">
                  ↓
                </div>

                <p>
                  {getDestinationAddress()}
                </p>
              </div>

            </div>

            <div className="driver-update-current-status">

              <span>
                CURRENT STATUS
              </span>

              <strong>
                {getCurrentStatusLabel()}
              </strong>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="driver-update-alert driver-update-alert-error">
              <span>⚠️</span>

              <p>
                {error}
              </p>
            </div>
          )}


          {/* SUCCESS */}

          {successMessage && (
            <div className="driver-update-alert driver-update-alert-success">
              <span>✅</span>

              <p>
                {successMessage}
              </p>
            </div>
          )}


          {/* STATUS OPTIONS */}

          <div className="driver-update-card">

            <div className="driver-update-card-header">

              <div className="driver-update-card-icon">
                🔄
              </div>

              <div>
                <h3>
                  Select New Status
                </h3>

                <p>
                  Choose the current stage of
                  the relocation.
                </p>
              </div>

            </div>


            <div className="driver-status-options">

              {statusOptions.map(
                (option) => {

                  const isCurrent =
                    booking?.status ===
                    option.value;

                  const isSelected =
                    selectedStatus ===
                    option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`driver-status-option ${
                        isSelected
                          ? "driver-status-option-selected"
                          : ""
                      } ${
                        isCurrent
                          ? "driver-status-option-current"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedStatus(
                          option.value
                        )
                      }
                      disabled={
                        updating
                      }
                    >

                      <div className="driver-status-option-icon">
                        {option.icon}
                      </div>

                      <div className="driver-status-option-content">

                        <div className="driver-status-option-title-row">

                          <strong>
                            {option.label}
                          </strong>

                          {isCurrent && (
                            <span className="driver-current-badge">
                              Current
                            </span>
                          )}

                        </div>

                        <p>
                          {option.description}
                        </p>

                      </div>

                      <div className="driver-status-radio">

                        <span></span>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>


          {/* MOVE INFORMATION */}

          <div className="driver-update-card">

            <div className="driver-update-card-header">

              <div className="driver-update-card-icon">
                📋
              </div>

              <div>
                <h3>
                  Move Information
                </h3>

                <p>
                  Current booking information
                </p>
              </div>

            </div>

            <div className="driver-update-info-grid">

              <div>
                <span>
                  Moving Date
                </span>

                <strong>
                  {formatDate(
                    booking?.moveRequest
                      ?.movingDate
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Property Type
                </span>

                <strong>
                  {booking?.moveRequest
                    ?.propertyType ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Vehicle
                </span>

                <strong>
                  {booking?.selectedVehicle
                    ?.name ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Customer
                </span>

                <strong>
                  {booking?.customer
                    ?.name ||
                    "Not available"}
                </strong>
              </div>

            </div>

          </div>


          {/* UPDATE ACTION */}

          <div className="driver-update-action-card">

            <div>

              <span>
                SELECTED STATUS
              </span>

              <strong>
                {
                  statusLabelMap[
                    selectedStatus
                  ] ||
                  "Select a status"
                }
              </strong>

            </div>

            <button
              className="driver-update-submit-btn"
              onClick={
                handleStatusUpdate
              }
              disabled={
                updating ||
                !selectedStatus ||
                selectedStatus ===
                  booking?.status
              }
            >
              {updating
                ? "Updating..."
                : "Update Move Status →"}
            </button>

          </div>

        </section>

      </main>
    </div>
  );
};

export default DriverUpdateStatus;