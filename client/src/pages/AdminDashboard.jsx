import React, {
    useEffect,
    useState,
} from "react";

import API from "../services/api";

import AdminSidebar from "../components/AdminSidebar";

import "./AdminDashboard.css";


const AdminDashboard = () => {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [bookings, setBookings] =
        useState([]);

    const [drivers, setDrivers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [assigningBooking, setAssigningBooking] =
        useState(null);

    const [selectedDrivers, setSelectedDrivers] =
        useState({});

    const [assigning, setAssigning] =
        useState(false);


    /*
    ==================================================
    GET DASHBOARD DATA
    ==================================================
    */

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Admin authentication token not found. Please login again."
                );

                return;
            }


            /*
            ==========================================
            GET ALL BOOKINGS
            ==========================================
            */

            const bookingResponse =
                await API.get(
                    "/bookings/all",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            /*
            ==========================================
            GET ALL DRIVERS
            ==========================================
            */

            const driverResponse =
                await API.get(
                    "/auth/drivers",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            /*
            ==========================================
            SET BOOKINGS
            ==========================================
            */

            if (
                bookingResponse?.data?.success
            ) {

                setBookings(
                    bookingResponse
                        .data
                        .bookings || []
                );

            } else {

                setBookings([]);

            }


            /*
            ==========================================
            SET DRIVERS
            ==========================================
            */

            if (
                driverResponse?.data?.success
            ) {

                setDrivers(
                    driverResponse
                        .data
                        .drivers || []
                );

            } else {

                setDrivers([]);

            }

        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load admin dashboard. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    ==================================================
    INITIAL LOAD
    ==================================================
    */

    useEffect(() => {

        fetchDashboardData();

    }, []);


    /*
    ==================================================
    STATISTICS
    ==================================================
    */

    const totalBookings =
        bookings.length;


    const activeBookings =
        bookings.filter(
            (booking) =>
                ![
                    "DELIVERED",
                    "CANCELLED",
                ].includes(
                    booking.status
                )
        ).length;


    const completedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "DELIVERED"
        ).length;


    /*
    ==================================================
    UNIQUE CUSTOMERS
    ==================================================
    */

    const customerIds =
        new Set(
            bookings
                .map(
                    (booking) =>
                        booking.customer?._id
                )
                .filter(Boolean)
        );


    const totalCustomers =
        customerIds.size;


    /*
    ==================================================
    PENDING DRIVER ASSIGNMENTS
    ==================================================
    */

    const pendingAssignments =
        bookings.filter(
            (booking) =>
                !booking.driver &&
                booking.status !==
                    "CANCELLED"
        ).length;


    /*
    ==================================================
    DRIVER SELECT
    ==================================================
    */

    const handleDriverChange = (
        bookingId,
        driverId
    ) => {

        setSelectedDrivers(
            (previous) => ({
                ...previous,

                [bookingId]:
                    driverId,
            })
        );

    };


    /*
    ==================================================
    ASSIGN DRIVER
    ==================================================
    */

    const handleAssignDriver =
        async (bookingId) => {

            try {

                const driverId =
                    selectedDrivers[
                        bookingId
                    ];


                /*
                VALIDATE DRIVER
                */

                if (!driverId) {

                    alert(
                        "Please select a driver first."
                    );

                    return;
                }


                /*
                GET ADMIN TOKEN
                */

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    alert(
                        "Admin session expired. Please login again."
                    );

                    return;
                }


                setAssigning(true);

                setAssigningBooking(
                    bookingId
                );


                /*
                ======================================
                API REQUEST
                ======================================
                */

                const response =
                    await API.patch(
                        `/bookings/${bookingId}/assign-driver`,
                        {
                            driverId,
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                /*
                ======================================
                CHECK RESPONSE
                ======================================
                */

                if (
                    !response?.data?.success
                ) {

                    alert(
                        response?.data?.message ||
                        "Unable to assign driver."
                    );

                    return;
                }


                /*
                ======================================
                UPDATE BOOKING IN UI
                ======================================
                */

                setBookings(
                    (previousBookings) =>
                        previousBookings.map(
                            (booking) =>
                                booking._id ===
                                bookingId
                                    ? response
                                          .data
                                          .booking
                                    : booking
                        )
                );


                /*
                CLEAR SELECTED DRIVER
                */

                setSelectedDrivers(
                    (previous) => {

                        const updated = {
                            ...previous,
                        };

                        delete updated[
                            bookingId
                        ];

                        return updated;

                    }
                );


                alert(
                    "Driver assigned successfully."
                );


            } catch (error) {

                console.error(
                    "Assign driver error:",
                    error
                );


                alert(
                    error.response?.data?.message ||
                    "Unable to assign driver."
                );

            } finally {

                setAssigning(false);

                setAssigningBooking(
                    null
                );

            }

        };


    /*
    ==================================================
    STATUS LABEL
    ==================================================
    */

    const getStatusLabel =
        (status) => {

            if (!status) {

                return "Unknown";

            }


            return status
                .replaceAll(
                    "_",
                    " "
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

                return "-";

            }


            const formattedDate =
                new Date(date);


            if (
                Number.isNaN(
                    formattedDate.getTime()
                )
            ) {

                return "-";

            }


            return formattedDate.toLocaleDateString(
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
                booking?.createdAt ||
                null
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

                "Pickup address unavailable"
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
    LOADING SCREEN
    ==================================================
    */

    if (loading) {

        return (

            <div className="admin-dashboard-loading">

                <div className="admin-loading-spinner"></div>

                <p>
                    Loading admin dashboard...
                </p>

            </div>

        );

    }


    /*
    ==================================================
    MAIN DASHBOARD
    ==================================================
    */

    return (

        <div className="admin-dashboard">


            {/* ======================================
                ADMIN SIDEBAR
            ====================================== */}

            <AdminSidebar
                isOpen={
                    sidebarOpen
                }
                setIsOpen={
                    setSidebarOpen
                }
            />


            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <main className="admin-main-content">


                {/* ==================================
                    MOBILE HEADER
                ================================== */}

                <header className="admin-mobile-header">

                    <button
                        className="admin-mobile-menu-btn"
                        onClick={() =>
                            setSidebarOpen(
                                true
                            )
                        }
                    >
                        ☰
                    </button>


                    <div>

                        <strong>
                            Move-Home
                        </strong>

                        <span>
                            Admin Panel
                        </span>

                    </div>

                </header>


                {/* ==================================
                    PAGE HEADER
                ================================== */}

                <section className="admin-page-header">

                    <div>

                        <p className="admin-page-label">
                            ADMINISTRATION
                        </p>


                        <h1>
                            Dashboard
                        </h1>


                        <p>
                            Monitor bookings,
                            drivers and
                            relocation
                            operations from
                            one place.
                        </p>

                    </div>


                    <button
                        className="admin-refresh-btn"
                        onClick={
                            fetchDashboardData
                        }
                    >
                        ↻ Refresh
                    </button>

                </section>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="admin-error-box">

                        ⚠ {error}

                    </div>

                )}


                {/* ==================================
                    STATISTICS
                ================================== */}

                <section className="admin-stats-grid">


                    {/* TOTAL BOOKINGS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon blue">
                            📦
                        </div>


                        <div>

                            <span>
                                Total Bookings
                            </span>


                            <strong>
                                {
                                    totalBookings
                                }
                            </strong>

                        </div>

                    </div>


                    {/* TOTAL DRIVERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon green">
                            🚚
                        </div>


                        <div>

                            <span>
                                Total Drivers
                            </span>


                            <strong>
                                {
                                    drivers.length
                                }
                            </strong>

                        </div>

                    </div>


                    {/* CUSTOMERS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon purple">
                            👥
                        </div>


                        <div>

                            <span>
                                Customers
                            </span>


                            <strong>
                                {
                                    totalCustomers
                                }
                            </strong>

                        </div>

                    </div>


                    {/* ACTIVE MOVES */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon orange">
                            🚛
                        </div>


                        <div>

                            <span>
                                Active Moves
                            </span>


                            <strong>
                                {
                                    activeBookings
                                }
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    QUICK SUMMARY
                ================================== */}

                <section className="admin-summary-grid">


                    {/* COMPLETED */}

                    <div className="admin-summary-card">

                        <span>
                            Completed Moves
                        </span>


                        <strong>
                            {
                                completedBookings
                            }
                        </strong>


                        <small>
                            Successfully delivered
                        </small>

                    </div>


                    {/* AVAILABLE DRIVERS */}

                    <div className="admin-summary-card">

                        <span>
                            Available Drivers
                        </span>


                        <strong>
                            {
                                drivers.length
                            }
                        </strong>


                        <small>
                            Registered driver accounts
                        </small>

                    </div>


                    {/* PENDING */}

                    <div className="admin-summary-card">

                        <span>
                            Pending Assignment
                        </span>


                        <strong>
                            {
                                pendingAssignments
                            }
                        </strong>


                        <small>
                            Bookings waiting for driver
                        </small>

                    </div>

                </section>


                {/* ==================================
                    BOOKING MANAGEMENT
                ================================== */}

                <section className="admin-bookings-section">


                    {/* SECTION HEADER */}

                    <div className="admin-section-header">

                        <div>

                            <p>
                                OPERATIONS
                            </p>


                            <h2>
                                Booking Management
                            </h2>

                        </div>


                        <span>

                            {bookings.length}

                            {" "}

                            {bookings.length === 1
                                ? "booking"
                                : "bookings"}

                        </span>

                    </div>


                    {/* ==================================
                        NO BOOKINGS
                    ================================== */}

                    {bookings.length === 0 ? (

                        <div className="admin-empty-state">

                            <div>
                                📦
                            </div>


                            <h3>
                                No bookings yet
                            </h3>


                            <p>
                                Customer bookings
                                will appear here.
                            </p>

                        </div>

                    ) : (


                        /* ==================================
                           BOOKINGS TABLE
                        ================================== */

                        <div className="admin-bookings-table-wrapper">

                            <table className="admin-bookings-table">


                                {/* TABLE HEADER */}

                                <thead>

                                    <tr>

                                        <th>
                                            Booking
                                        </th>


                                        <th>
                                            Customer
                                        </th>


                                        <th>
                                            Move
                                        </th>


                                        <th>
                                            Status
                                        </th>


                                        <th>
                                            Driver
                                        </th>


                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>


                                {/* TABLE BODY */}

                                <tbody>

                                    {bookings.map(
                                        (
                                            booking
                                        ) => (

                                            <tr
                                                key={
                                                    booking._id
                                                }
                                            >


                                                {/* ==============================
                                                    BOOKING
                                                ============================== */}

                                                <td>

                                                    <div className="booking-id-cell">

                                                        <strong>
                                                            {
                                                                booking.bookingId ||
                                                                "N/A"
                                                            }
                                                        </strong>


                                                        <small>
                                                            {
                                                                booking._id ||
                                                                "-"
                                                            }
                                                        </small>

                                                    </div>

                                                </td>


                                                {/* ==============================
                                                    CUSTOMER
                                                ============================== */}

                                                <td>

                                                    <div className="customer-cell">

                                                        <strong>
                                                            {
                                                                booking
                                                                    .customer
                                                                    ?.name ||
                                                                "Unknown Customer"
                                                            }
                                                        </strong>


                                                        <small>
                                                            {
                                                                booking
                                                                    .customer
                                                                    ?.email ||
                                                                "-"
                                                            }
                                                        </small>

                                                    </div>

                                                </td>


                                                {/* ==============================
                                                    MOVE
                                                ============================== */}

                                                <td>

                                                    <div className="move-cell">


                                                        {/* PICKUP */}

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


                                                        {/* ARROW */}

                                                        <span>
                                                            ↓
                                                        </span>


                                                        {/* DESTINATION */}

                                                        <small
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
                                                        </small>

                                                    </div>

                                                </td>


                                                {/* ==============================
                                                    STATUS
                                                ============================== */}

                                                <td>

                                                    <span
                                                        className={`booking-status ${getStatusClass(
                                                            booking.status
                                                        )}`}
                                                    >

                                                        {
                                                            getStatusLabel(
                                                                booking.status
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* ==============================
                                                    DRIVER
                                                ============================== */}

                                                <td>

                                                    {booking.driver ? (

                                                        <div className="assigned-driver-cell">

                                                            <strong>
                                                                {
                                                                    booking
                                                                        .driver
                                                                        ?.name ||
                                                                    "Driver"
                                                                }
                                                            </strong>


                                                            <small>
                                                                Assigned
                                                            </small>

                                                        </div>

                                                    ) : (

                                                        <div className="assign-driver-cell">


                                                            {/* DRIVER SELECT */}

                                                            <select
                                                                value={
                                                                    selectedDrivers[
                                                                        booking
                                                                            ._id
                                                                    ] ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleDriverChange(
                                                                        booking._id,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            >

                                                                <option value="">
                                                                    Select Driver
                                                                </option>


                                                                {drivers.map(
                                                                    (
                                                                        driver
                                                                    ) => (

                                                                        <option
                                                                            key={
                                                                                driver._id
                                                                            }
                                                                            value={
                                                                                driver._id
                                                                            }
                                                                        >
                                                                            {
                                                                                driver.name
                                                                            }
                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>


                                                            {/* ASSIGN BUTTON */}

                                                            <button
                                                                onClick={() =>
                                                                    handleAssignDriver(
                                                                        booking._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    assigning &&
                                                                    assigningBooking ===
                                                                        booking._id
                                                                }
                                                            >

                                                                {assigning &&
                                                                assigningBooking ===
                                                                    booking._id

                                                                    ? "Assigning..."

                                                                    : "Assign Driver"}

                                                            </button>

                                                        </div>

                                                    )}

                                                </td>


                                                {/* ==============================
                                                    DATE
                                                ============================== */}

                                                <td>

                                                    <span className="booking-date">

                                                        {
                                                            formatDate(
                                                                getMovingDate(
                                                                    booking
                                                                )
                                                            )
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};


export default AdminDashboard;