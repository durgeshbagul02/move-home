const express = require("express");

const Booking = require("../models/Booking");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
CREATE BOOKING
POST /api/bookings
==================================================
*/

router.post(
    "/",
    protect,
    async(req, res) => {

        try {

            if (req.user.role !== "customer") {

                return res.status(403).json({
                    success: false,
                    message: "Only customers can create bookings.",
                });

            }

            const {
                moveRequest,
                movingItems,
                selectedVehicle,
                priceEstimate,
                paymentMethod,
                notes,
            } = req.body;

            if (!moveRequest ||
                !selectedVehicle ||
                !priceEstimate
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Move request, vehicle and price estimate are required.",
                });

            }

            /*
            Generate booking ID

            Example:
            MH-38655575
            */

            const bookingId =
                "MH-" +
                Date.now()
                .toString()
                .slice(-8);

            const booking =
                await Booking.create({

                    bookingId,

                    customer: req.user._id,

                    driver: null,

                    status: "BOOKING_CONFIRMED",

                    moveRequest,

                    movingItems: movingItems || [],

                    selectedVehicle,

                    priceEstimate,

                    paymentMethod: paymentMethod || null,

                    notes: notes || "",

                });

            res.status(201).json({

                success: true,

                message: "Booking created successfully.",

                booking: {

                    id: booking._id,

                    bookingId: booking.bookingId,

                    status: booking.status,

                    customer: booking.customer,

                    driver: booking.driver,

                    moveRequest: booking.moveRequest,

                    movingItems: booking.movingItems,

                    selectedVehicle: booking.selectedVehicle,

                    priceEstimate: booking.priceEstimate,

                    paymentStatus: booking.paymentStatus,

                    paymentMethod: booking.paymentMethod,

                    notes: booking.notes,

                    createdAt: booking.createdAt,

                },

            });

        } catch (error) {

            console.error(
                "Create booking error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while creating booking.",

            });

        }

    }
);


/*
==================================================
GET CUSTOMER BOOKINGS
GET /api/bookings/my
==================================================
*/

router.get(
    "/my",
    protect,
    async(req, res) => {

        try {

            if (req.user.role !== "customer") {

                return res.status(403).json({

                    success: false,

                    message: "Only customers can access customer bookings.",

                });

            }

            const bookings =
                await Booking.find({
                    customer: req.user._id,
                })
                .populate(
                    "driver",
                    "name email phone role"
                )
                .sort({
                    createdAt: -1,
                });

            res.status(200).json({

                success: true,

                count: bookings.length,

                bookings,

            });

        } catch (error) {

            console.error(
                "Customer bookings error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while fetching bookings.",

            });

        }

    }
);


/*
==================================================
GET DRIVER BOOKINGS
GET /api/bookings/driver
==================================================
*/

router.get(
    "/driver",
    protect,
    async(req, res) => {

        try {

            if (req.user.role !== "driver") {

                return res.status(403).json({

                    success: false,

                    message: "Only drivers can access assigned bookings.",

                });

            }

            const bookings =
                await Booking.find({

                    driver: req.user._id,

                })
                .populate(
                    "customer",
                    "name email phone"
                )
                .populate(
                    "driver",
                    "name email phone"
                )
                .sort({
                    createdAt: -1,
                });

            res.status(200).json({

                success: true,

                count: bookings.length,

                bookings,

            });

        } catch (error) {

            console.error(
                "Driver bookings error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while fetching driver bookings.",

            });

        }

    }
);


/*
==================================================
GET ALL BOOKINGS - ADMIN
GET /api/bookings/all
==================================================
*/

router.get(
    "/all",
    protect,
    async(req, res) => {

        try {

            if (req.user.role !== "admin") {

                return res.status(403).json({

                    success: false,

                    message: "Only admin can access all bookings.",

                });

            }

            const bookings =
                await Booking.find({})
                .populate(
                    "customer",
                    "name email phone"
                )
                .populate(
                    "driver",
                    "name email phone role"
                )
                .sort({
                    createdAt: -1,
                });

            res.status(200).json({

                success: true,

                count: bookings.length,

                bookings,

            });

        } catch (error) {

            console.error(
                "All bookings error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while fetching all bookings.",

            });

        }

    }
);


/*
==================================================
GET SINGLE BOOKING
GET /api/bookings/:id
==================================================
*/

router.get(
    "/:id",
    protect,
    async(req, res) => {

        try {

            const booking =
                await Booking.findById(
                    req.params.id
                )
                .populate(
                    "customer",
                    "name email phone"
                )
                .populate(
                    "driver",
                    "name email phone"
                );

            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message: "Booking not found.",

                });

            }

            const isCustomer =
                booking.customer &&
                booking.customer._id.toString() ===
                req.user._id.toString();

            const isDriver =
                booking.driver &&
                booking.driver._id.toString() ===
                req.user._id.toString();

            const isAdmin =
                req.user.role === "admin";

            if (!isCustomer &&
                !isDriver &&
                !isAdmin
            ) {

                return res.status(403).json({

                    success: false,

                    message: "You are not authorized to view this booking.",

                });

            }

            res.status(200).json({

                success: true,

                booking,

            });

        } catch (error) {

            console.error(
                "Get booking error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while fetching booking.",

            });

        }

    }
);


/*
==================================================
ASSIGN DRIVER - ADMIN
PATCH /api/bookings/:id/assign-driver
==================================================
*/

router.patch(
    "/:id/assign-driver",
    protect,
    async(req, res) => {

        try {

            if (req.user.role !== "admin") {

                return res.status(403).json({

                    success: false,

                    message: "Only admin can assign drivers.",

                });

            }

            const {
                driverId,
            } = req.body;

            if (!driverId) {

                return res.status(400).json({

                    success: false,

                    message: "Driver ID is required.",

                });

            }

            /*
            Find selected driver
            */

            const driver =
                await User.findById(
                    driverId
                );

            if (!driver) {

                return res.status(404).json({

                    success: false,

                    message: "Driver not found.",

                });

            }

            /*
            Verify selected user
            is actually a driver
            */

            if (driver.role !== "driver") {

                return res.status(400).json({

                    success: false,

                    message: "Selected user is not a driver.",

                });

            }

            /*
            Find booking
            */

            const booking =
                await Booking.findById(
                    req.params.id
                );

            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message: "Booking not found.",

                });

            }

            /*
            Assign driver
            */

            booking.driver =
                driver._id;

            booking.status =
                "DRIVER_ASSIGNED";

            await booking.save();

            /*
            Return updated booking
            */

            const updatedBooking =
                await Booking.findById(
                    booking._id
                )
                .populate(
                    "customer",
                    "name email phone"
                )
                .populate(
                    "driver",
                    "name email phone role"
                );

            /*
            ==========================================
            REAL-TIME DRIVER ASSIGNMENT UPDATE
            ==========================================
            */

            const io =
                req.app.get("io");

            if (io) {

                io.to(
                    `booking-${booking._id}`
                ).emit(
                    "booking-status-updated",
                    updatedBooking
                );

                console.log(
                    `Real-time driver assignment sent for booking ${booking.bookingId}`
                );

            }

            res.status(200).json({

                success: true,

                message: "Driver assigned successfully.",

                booking: updatedBooking,

            });

        } catch (error) {

            console.error(
                "Assign driver error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while assigning driver.",

            });

        }

    }
);


/*
==================================================
UPDATE BOOKING STATUS - DRIVER
PATCH /api/bookings/:id/status
==================================================
*/

router.patch(
    "/:id/status",
    protect,
    async(req, res) => {

        try {

            if (req.user.role !== "driver") {

                return res.status(403).json({

                    success: false,

                    message: "Only drivers can update booking status.",

                });

            }

            const {
                status,
            } = req.body;

            /*
            Allowed booking statuses
            */

            const allowedStatuses = [

                "BOOKING_CONFIRMED",

                "DRIVER_ASSIGNED",

                "PICKUP_SCHEDULED",

                "ITEMS_LOADING",

                "ITEMS_LOADED",

                "ON_THE_WAY",

                "ARRIVED",

                "DELIVERED",

                "CANCELLED",

            ];

            if (!allowedStatuses.includes(
                    status
                )) {

                return res.status(400).json({

                    success: false,

                    message: "Invalid booking status.",

                });

            }

            /*
            Find booking
            */

            const booking =
                await Booking.findById(
                    req.params.id
                );

            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message: "Booking not found.",

                });

            }

            /*
            Driver can update
            only their own assigned booking.
            */

            if (!booking.driver ||
                booking.driver.toString() !==
                req.user._id.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message: "This booking is not assigned to you.",

                });

            }

            /*
            Update booking status
            */

            booking.status =
                status;

            await booking.save();

            /*
            Get updated booking
            with customer and driver details
            */

            const updatedBooking =
                await Booking.findById(
                    booking._id
                )
                .populate(
                    "customer",
                    "name email phone"
                )
                .populate(
                    "driver",
                    "name email phone role"
                );

            /*
            ==========================================
            REAL-TIME SOCKET.IO STATUS UPDATE
            ==========================================
            */

            const io =
                req.app.get("io");

            if (io) {

                io.to(
                    `booking-${booking._id}`
                ).emit(
                    "booking-status-updated",
                    updatedBooking
                );

                console.log(
                    `Real-time status update sent for booking ${booking.bookingId}`
                );

            }

            /*
            Send response to driver
            */

            res.status(200).json({

                success: true,

                message: "Booking status updated successfully.",

                booking: updatedBooking,

            });

        } catch (error) {

            console.error(
                "Update booking status error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message: "Server error while updating booking status.",

            });

        }

    }
);


/*
==================================================
EXPORT ROUTER
==================================================
*/

module.exports = router;