const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const resetPassword = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const email = "durgeshrbagul2206@gmail.com";
        const newPassword = "NewPassword123";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate({ email: email.toLowerCase().trim() }, { password: hashedPassword }, { new: true });

        if (!user) {
            console.log("User not found with this email.");
        } else {
            console.log("Password reset successfully!");
            console.log("Email:", user.email);
            console.log("New password:", newPassword);
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error("Password reset failed:", error.message);
    }
};

resetPassword();