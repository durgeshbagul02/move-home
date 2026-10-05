const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    status: {
        type: String,
        enum: [
            "BOOKING_CONFIRMED",
            "DRIVER_ASSIGNED",
            "PICKUP_SCHEDULED",
            "ITEMS_LOADING",
            "ITEMS_LOADED",
            "ON_THE_WAY",
            "ARRIVED",
            "DELIVERED",
            "CANCELLED",
        ],
        default: "BOOKING_CONFIRMED",
    },

    moveRequest: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },

    movingItems: {
        type: mongoose.Schema.Types.Mixed,
        default: [],
    },

    selectedVehicle: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },

    priceEstimate: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: [
            "PENDING",
            "PAID",
            "FAILED",
        ],
        default: "PENDING",
    },

    paymentMethod: {
        type: String,
        default: null,
    },

    notes: {
        type: String,
        default: "",
        trim: true,
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model(
    "Booking",
    bookingSchema
);

module.exports = Booking;