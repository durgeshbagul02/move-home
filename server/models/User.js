const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,

            // Exactly 10 digits
            match: [
                /^[0-9]{10}$/,
                "Phone number must be exactly 10 digits",
            ],
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: [
                "customer",
                "driver",
                "admin",
            ],
            default: "customer",
        },
    },

    {
        timestamps: true,
    }
);

const User = mongoose.model(
    "User",
    userSchema
);

module.exports = User;