import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import DriverSidebar from "../components/DriverSidebar";
import API from "../services/api";

import "./DriverAssignedMoves.css";


const DriverAssignedMoves = () => {

  const navigate = useNavigate();


  /*
  ==================================================
  STATE
  ==================================================
  */

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  ==================================================
  LOAD ASSIGNED BOOKINGS
  ==================================================
  */

  const loadBookings = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");


        /*
        GET TOKEN
        */

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate(
            "/driver-login"
          );

          return;

        }


        /*
        GET DRIVER BOOKINGS
        */

        const response =
          await API.get(
            "/bookings/driver",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        /*
        CHECK RESPONSE
        */

        if (
          !response?.data?.success
        ) {

          setBookings([]);

          setError(
            response?.data?.message ||
            "Unable to load assigned moves."
          );

          return;

        }


        /*
        SET BOOKINGS
        */

        setBookings(
          response.data.bookings ||
          []
        );


      } catch (error) {

        console.error(
          "Unable to load assigned moves:",
          error
        );


        /*
        AUTH ERROR
        */

        if (
          error.response?.status ===
            401 ||
          error.response?.status ===
            403
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "driverSelectedBooking"
          );

          navigate(
            "/driver-login"
          );

          return;

        }


        setBookings([]);

        setError(
          error.response?.data?.message ||
          "Unable to load assigned moves. Please try again."
        );

      } finally {

        setLoading(false);

      }

    },
    [navigate]
  );


  /*
  ==================================================
  AUTHENTICATE DRIVER
  ==================================================
  */

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const savedUser =
      localStorage.getItem(
        "user"
      );


    /*
    TOKEN CHECK
    */

    if (!token) {

      navigate(
        "/driver-login"
      );

      return;

    }


    /*
    USER CHECK
    */

    try {

      const parsedUser =
        savedUser
          ? JSON.parse(
              savedUser
            )
          : null;


      if (
        !parsedUser ||
        parsedUser.role?.toLowerCase() !==
          "driver"
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate(
          "/driver-login"
        );

        return;

      }


      setUser(
        parsedUser
      );


      /*
      LOAD BOOKINGS
      */

      loadBookings();

    } catch (error) {

      console.error(
        "Driver authentication error:",
        error
      );


      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate(
        "/driver-login"
      );

    }

  }, [
    navigate,
    loadBookings,
  ]);


  /*
  ==================================================
  STATUS LABEL
  ==================================================
  */

  const getStatusLabel =
    (status) => {

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
        status ||
        "Unknown"
      );

    };


  /*
  ==================================================
  STATUS CLASS
  ==================================================
  */

  const getStatusClass =
    (status) => {

      switch (status) {

        case "BOOKING_CONFIRMED":

          return "status-confirmed";


        case "DRIVER_ASSIGNED":

          return "status-assigned";


        case "PICKUP_SCHEDULED":

          return "status-scheduled";


        case "ITEMS_LOADING":

        case "ITEMS_LOADED":

          return "status-loading";


        case "ON_THE_WAY":

        case "ARRIVED":

          return "status-active";


        case "DELIVERED":

          return "status-delivered";


        case "CANCELLED":

          return "status-cancelled";


        default:

          return "status-default";

      }

    };


  /*
  ==================================================
  FORMAT DATE
  ==================================================
  */

  const formatDate =
    (date) => {

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
  ==================================================
  GET PICKUP ADDRESS
  ==================================================
  */

  const getPickupAddress =
    (booking) => {

      return (
        booking
          ?.moveRequest
          ?.pickupAddress ||

        booking
          ?.moveRequest
          ?.pickupLocation ||

        booking
          ?.moveRequest
          ?.pickup ||

        "Pickup location unavailable"
      );

    };


  /*
  ==================================================
  GET DESTINATION ADDRESS
  ==================================================
  */

  const getDestinationAddress =
    (booking) => {

      return (
        booking
          ?.moveRequest
          ?.destinationAddress ||

        booking
          ?.moveRequest
          ?.dropLocation ||

        booking
          ?.moveRequest
          ?.destination ||

        "Destination unavailable"
      );

    };


  /*
  ==================================================
  GET MOVING DATE
  ==================================================
  */

  const getMovingDate =
    (booking) => {

      return (
        booking
          ?.moveRequest
          ?.movingDate ||

        booking?.movingDate ||

        null
      );

    };


  /*
  ==================================================
  GET ITEM COUNT
  ==================================================
  */

  const getItemCount =
    (booking) => {

      const items =
        Array.isArray(
          booking?.movingItems
        )
          ? booking.movingItems
          : [];


      return items.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item?.quantity || 0
          ),
        0
      );

    };


  /*
  ==================================================
  GET TOTAL PRICE
  ==================================================
  */

  const getTotalPrice =
    (booking) => {

      return (
        booking
          ?.priceEstimate
          ?.totalEstimate ||

        booking
          ?.priceEstimate
          ?.total ||

        0
      );

    };


  /*
  ==================================================
  FORMAT PRICE
  ==================================================
  */

  const formatPrice =
    (amount) => {

      return Number(
        amount || 0
      ).toLocaleString(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      );

    };


  /*
  ==================================================
  HANDLE VIEW DETAILS
  ==================================================
  */

  const handleViewDetails =
    (booking) => {

      localStorage.setItem(
        "driverSelectedBooking",
        JSON.stringify(
          booking
        )
      );


      navigate(
        "/driver-move-details"
      );

    };


  /*
  ==================================================
  HANDLE UPDATE STATUS
  ==================================================
  */

  const handleUpdateStatus =
    (booking) => {

      localStorage.setItem(
        "driverSelectedBooking",
        JSON.stringify(
          booking
        )
      );


      navigate(
        "/driver-update-status"
      );

    };


  /*
  ==================================================
  DRIVER FIRST NAME
  ==================================================
  */

  const firstName =
    user?.name
      ?.split(" ")[0] ||
    "Driver";


  /*
  ==================================================
  DRIVER INITIALS
  ==================================================
  */

  const driverInitials =
    user?.name
      ? user.name
          .split(" ")
          .filter(Boolean)
          .map(
            (part) =>
              part.charAt(0)
          )
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "DR";


  /*
  ==================================================
  MAIN UI
  ==================================================
  */

  return (

    <div className="driver-assigned-page">


      {/* ==========================================
          DRIVER SIDEBAR
      ========================================== */}

      <DriverSidebar
        isOpen={
          sidebarOpen
        }
        setIsOpen={
          setSidebarOpen
        }
      />


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="driver-assigned-main">


        {/* ========================================
            TOPBAR
        ======================================== */}

        <header className="driver-assigned-topbar">


          {/* MOBILE MENU */}

          <button
            className="driver-mobile-menu-btn"
            onClick={() =>
              setSidebarOpen(
                true
              )
            }
            aria-label="Open menu"
          >
            ☰
          </button>


          {/* PAGE TITLE */}

          <div>

            <p className="driver-assigned-eyebrow">
              DRIVER PANEL
            </p>


            <h1>
              Assigned Moves
            </h1>


            <p className="driver-assigned-subtitle">
              Manage all relocation jobs
              assigned to you.
            </p>

          </div>


          {/* DRIVER */}

          <div className="driver-assigned-user">

            <div className="driver-assigned-avatar">

              {driverInitials}

            </div>


            <div>

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


        {/* ========================================
            CONTENT
        ======================================== */}

        <section className="driver-assigned-content">


          {/* ======================================
              SUMMARY
          ====================================== */}

          <div className="assigned-summary-card">


            <div className="assigned-summary-left">


              <span className="assigned-summary-icon">
                🚚
              </span>


              <div>

                <h2>
                  Hello, {firstName}!
                </h2>


                <p>
                  Here are the relocation
                  moves currently assigned
                  to you.
                </p>

              </div>

            </div>


            <div className="assigned-summary-count">

              <strong>
                {bookings.length}
              </strong>


              <span>
                Total Assigned
              </span>

            </div>

          </div>


          {/* ======================================
              ERROR
          ====================================== */}

          {error && (

            <div className="assigned-error-state">

              <div className="assigned-state-icon">
                ⚠️
              </div>


              <h3>
                Unable to load moves
              </h3>


              <p>
                {error}
              </p>


              <button
                onClick={
                  loadBookings
                }
              >
                Try Again
              </button>

            </div>

          )}


          {/* ======================================
              LOADING
          ====================================== */}

          {loading && (

            <div className="assigned-state">

              <div className="assigned-state-icon">
                ⏳
              </div>


              <h3>
                Loading assigned moves...
              </h3>


              <p>
                Fetching your latest
                assignments.
              </p>

            </div>

          )}


          {/* ======================================
              EMPTY
          ====================================== */}

          {!loading &&
            !error &&
            bookings.length === 0 && (

              <div className="assigned-state">

                <div className="assigned-state-icon">
                  📋
                </div>


                <h3>
                  No moves assigned
                </h3>


                <p>
                  You currently have no
                  relocation jobs assigned
                  to you.
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

            )}


          {/* ======================================
              BOOKINGS
          ====================================== */}

          {!loading &&
            !error &&
            bookings.length > 0 && (

              <div className="assigned-bookings">


                {bookings.map(
                  (
                    booking,
                    index
                  ) => (

                    <div
                      className="assigned-booking-card"
                      key={
                        booking._id ||
                        booking.bookingId ||
                        index
                      }
                    >


                      {/* ================================
                          CARD HEADER
                      ================================= */}

                      <div className="assigned-booking-header">


                        <div>

                          <span className="assigned-booking-number">
                            Move #{index + 1}
                          </span>


                          <h3>
                            {
                              booking.bookingId ||
                              "Booking"
                            }
                          </h3>

                        </div>


                        <span
                          className={`assigned-status ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {
                            getStatusLabel(
                              booking.status
                            )
                          }
                        </span>

                      </div>


                      {/* ================================
                          ROUTE
                      ================================= */}

                      <div className="assigned-route">


                        {/* PICKUP */}

                        <div className="assigned-location">


                          <div className="route-icon pickup">
                            ●
                          </div>


                          <div>

                            <span>
                              PICKUP
                            </span>


                            <strong
                              title={
                                getPickupAddress(
                                  booking
                                )
                              }
                            >
                              {
                                getPickupAddress(
                                  booking
                                )
                              }
                            </strong>

                          </div>

                        </div>


                        {/* ROUTE ARROW */}

                        <div className="assigned-route-line">

                          <span>
                            ↓
                          </span>

                        </div>


                        {/* DESTINATION */}

                        <div className="assigned-location">


                          <div className="route-icon destination">
                            ●
                          </div>


                          <div>

                            <span>
                              DESTINATION
                            </span>


                            <strong
                              title={
                                getDestinationAddress(
                                  booking
                                )
                              }
                            >
                              {
                                getDestinationAddress(
                                  booking
                                )
                              }
                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* ================================
                          DETAILS
                      ================================= */}

                      <div className="assigned-details-grid">


                        {/* MOVING DATE */}

                        <div className="assigned-detail">

                          <span>
                            📅
                          </span>


                          <div>

                            <small>
                              Moving Date
                            </small>


                            <strong>
                              {formatDate(
                                getMovingDate(
                                  booking
                                )
                              )}
                            </strong>

                          </div>

                        </div>


                        {/* PROPERTY */}

                        <div className="assigned-detail">

                          <span>
                            🏠
                          </span>


                          <div>

                            <small>
                              Property
                            </small>


                            <strong>
                              {
                                booking
                                  .moveRequest
                                  ?.propertyType ||
                                "Not specified"
                              }
                            </strong>

                          </div>

                        </div>


                        {/* VEHICLE */}

                        <div className="assigned-detail">

                          <span>
                            🚛
                          </span>


                          <div>

                            <small>
                              Vehicle
                            </small>


                            <strong>
                              {
                                booking
                                  .selectedVehicle
                                  ?.name ||
                                "Not specified"
                              }
                            </strong>

                          </div>

                        </div>


                        {/* ITEMS */}

                        <div className="assigned-detail">

                          <span>
                            📦
                          </span>


                          <div>

                            <small>
                              Items
                            </small>


                            <strong>
                              {
                                getItemCount(
                                  booking
                                )
                              }{" "}
                              items
                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* ================================
                          CUSTOMER
                      ================================= */}

                      <div className="assigned-customer">


                        <div className="customer-avatar">

                          {booking.customer?.name
                            ? booking.customer.name
                                .charAt(0)
                                .toUpperCase()
                            : "C"}

                        </div>


                        <div>

                          <small>
                            CUSTOMER
                          </small>


                          <strong>
                            {
                              booking
                                .customer
                                ?.name ||
                              "Customer"
                            }
                          </strong>


                          <span>
                            {
                              booking
                                .customer
                                ?.phone ||
                              "Phone unavailable"
                            }
                          </span>

                        </div>

                      </div>


                      {/* ================================
                          FOOTER
                      ================================= */}

                      <div className="assigned-booking-footer">


                        {/* PRICE */}

                        <div className="assigned-price">

                          <small>
                            Estimated Value
                          </small>


                          <strong>
                            {formatPrice(
                              getTotalPrice(
                                booking
                              )
                            )}
                          </strong>

                        </div>


                        {/* ACTIONS */}

                        <div className="assigned-actions">


                          {/* VIEW DETAILS */}

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


                          {/* UPDATE STATUS */}

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

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

      </main>

    </div>

  );

};


export default DriverAssignedMoves;