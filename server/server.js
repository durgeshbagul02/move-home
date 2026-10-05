const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

const app = express();

/*
====================================================
MIDDLEWARE
====================================================
*/

app.use(cors());

app.use(express.json());

/*
====================================================
DATABASE
====================================================
*/

connectDB();

/*
====================================================
ROOT ROUTE
====================================================
*/

app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,
            message: "Move-Home backend is running successfully",
        });
    }
);

/*
====================================================
AUTH ROUTES

/api/auth/register
/api/auth/login
/api/auth/create-driver
/api/auth/create-admin
/api/auth/profile
/api/auth/drivers
====================================================
*/

app.use(
    "/api/auth",
    authRoutes
);

/*
====================================================
BOOKING ROUTES

/api/bookings
/api/bookings/my
/api/bookings/all
/api/bookings/driver
/api/bookings/:id
====================================================
*/

app.use(
    "/api/bookings",
    bookingRoutes
);

/*
====================================================
HTTP SERVER
====================================================
*/

const PORT =
    process.env.PORT || 5000;

const server =
    http.createServer(app);

/*
====================================================
SOCKET.IO SERVER
====================================================
*/

const io =
    new Server(
        server, {
            cors: {
                origin: "http://localhost:5173",
                methods: [
                    "GET",
                    "POST",
                ],
            },
        }
    );

/*
====================================================
MAKE SOCKET.IO AVAILABLE
TO EXPRESS ROUTES
====================================================
*/

app.set(
    "io",
    io
);

/*
====================================================
SOCKET.IO CONNECTION
====================================================
*/

io.on(
    "connection",
    (socket) => {

        console.log(
            `Socket connected: ${socket.id}`
        );

        /*
        ================================================
        JOIN BOOKING ROOM
        ================================================
        */

        socket.on(
            "join-booking",
            (bookingId) => {

                if (!bookingId) {
                    return;
                }

                const roomName =
                    `booking-${bookingId}`;

                socket.join(
                    roomName
                );

                console.log(
                    `Socket ${socket.id} joined ${roomName}`
                );

            }
        );

        /*
        ================================================
        LEAVE BOOKING ROOM
        ================================================
        */

        socket.on(
            "leave-booking",
            (bookingId) => {

                if (!bookingId) {
                    return;
                }

                const roomName =
                    `booking-${bookingId}`;

                socket.leave(
                    roomName
                );

                console.log(
                    `Socket ${socket.id} left ${roomName}`
                );

            }
        );

        /*
        ================================================
        SOCKET DISCONNECT
        ================================================
        */

        socket.on(
            "disconnect",
            () => {

                console.log(
                    `Socket disconnected: ${socket.id}`
                );

            }
        );

    }
);

/*
====================================================
START SERVER
====================================================
*/

server.listen(
    PORT,
    () => {

        console.log(
            `Move-Home server running on port ${PORT}`
        );

        console.log(
            "Socket.IO server is ready"
        );

    }
);