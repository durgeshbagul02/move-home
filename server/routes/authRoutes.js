const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


/*
==================================================
REGISTER CUSTOMER
POST /api/auth/register
==================================================
*/

router.post(
    "/register",
    async(req, res) => {
        try {

            const {
                name,
                email,
                phone,
                password,
            } = req.body;

            /*
            Validate required fields
            */

            if (!name ||
                !email ||
                !phone ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill all required fields.",
                });
            }

            /*
            Check existing email
            */

            const existingUser =
                await User.findOne({
                    email: email
                        .trim()
                        .toLowerCase(),
                });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists.",
                });
            }

            /*
            Hash password
            */

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            /*
            Create customer
            */

            const user =
                await User.create({
                    name: name.trim(),

                    email: email
                        .trim()
                        .toLowerCase(),

                    phone: phone.trim(),

                    password: hashedPassword,

                    role: "customer",
                });

            res.status(201).json({
                success: true,

                message: "Registration successful.",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            });

        } catch (error) {

            console.error(
                "Registration error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Server error during registration.",
            });
        }
    }
);


/*
==================================================
LOGIN
POST /api/auth/login
==================================================
*/

router.post(
    "/login",
    async(req, res) => {
        try {

            const {
                email,
                password,
            } = req.body;

            if (!email ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required.",
                });
            }

            /*
            Find user
            */

            const user =
                await User.findOne({
                    email: email
                        .trim()
                        .toLowerCase(),
                });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
            }

            /*
            Compare password
            */

            const isPasswordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isPasswordCorrect) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
            }

            /*
            Create JWT
            */

            const token =
                jwt.sign({
                        id: user._id,
                        role: user.role,
                    },
                    process.env.JWT_SECRET, {
                        expiresIn: "7d",
                    }
                );

            res.status(200).json({
                success: true,

                message: "Login successful.",

                token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            });

        } catch (error) {

            console.error(
                "Login error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Server error during login.",
            });
        }
    }
);


/*
==================================================
CREATE DRIVER
POST /api/auth/create-driver
==================================================
*/

router.post(
    "/create-driver",
    protect,
    async(req, res) => {
        try {

            /*
            Only admin can create
            driver accounts.
            */

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admin can create driver accounts.",
                });
            }

            const {
                name,
                email,
                phone,
                password,
            } = req.body;

            if (!name ||
                !email ||
                !phone ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, phone and password are required.",
                });
            }

            /*
            Check duplicate email
            */

            const existingDriver =
                await User.findOne({
                    email: email
                        .trim()
                        .toLowerCase(),
                });

            if (existingDriver) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists.",
                });
            }

            /*
            Hash password
            */

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            /*
            Create driver
            */

            const driver =
                await User.create({
                    name: name.trim(),

                    email: email
                        .trim()
                        .toLowerCase(),

                    phone: phone.trim(),

                    password: hashedPassword,

                    role: "driver",
                });

            res.status(201).json({
                success: true,

                message: "Driver created successfully.",

                driver: {
                    id: driver._id,
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    role: driver.role,
                },
            });

        } catch (error) {

            console.error(
                "Create driver error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Server error while creating driver.",
            });
        }
    }
);


/*
==================================================
CREATE ADMIN
POST /api/auth/create-admin
==================================================
*/

router.post(
    "/create-admin",
    async(req, res) => {
        try {

            const {
                name,
                email,
                phone,
                password,
            } = req.body;

            if (!name ||
                !email ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email and password are required.",
                });
            }

            /*
            Check duplicate email
            */

            const existingUser =
                await User.findOne({
                    email: email
                        .trim()
                        .toLowerCase(),
                });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists.",
                });
            }

            /*
            Hash password
            */

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            /*
            Create admin
            */

            const admin =
                await User.create({
                    name: name.trim(),

                    email: email
                        .trim()
                        .toLowerCase(),

                    phone: phone ?
                        phone.trim() :
                        "",

                    password: hashedPassword,

                    role: "admin",
                });

            res.status(201).json({
                success: true,

                message: "Admin created successfully.",

                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone,
                    role: admin.role,
                },
            });

        } catch (error) {

            console.error(
                "Create admin error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Server error while creating admin.",
            });
        }
    }
);


/*
==================================================
GET CURRENT PROFILE
GET /api/auth/profile
==================================================
*/

router.get(
    "/profile",
    protect,
    async(req, res) => {
        try {

            const user =
                await User.findById(
                    req.user._id
                ).select(
                    "-password"
                );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            res.status(200).json({
                success: true,
                user,
            });

        } catch (error) {

            console.error(
                "Profile error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Server error while fetching profile.",
            });
        }
    }
);


/*
==================================================
GET ALL DRIVERS - ADMIN
GET /api/auth/drivers
==================================================
*/

router.get(
    "/drivers",
    protect,
    async(req, res) => {
        try {

            /*
            Only admin can see
            all registered drivers.
            */

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admin can access drivers.",
                });
            }

            const drivers =
                await User.find({
                    role: "driver",
                })
                .select(
                    "name email phone role createdAt"
                )
                .sort({
                    createdAt: -1,
                });

            res.status(200).json({
                success: true,

                count: drivers.length,

                drivers,
            });

        } catch (error) {

            console.error(
                "Get drivers error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message: "Server error while fetching drivers.",
            });
        }
    }
);


module.exports = router;