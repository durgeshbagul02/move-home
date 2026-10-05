import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= PAGES =================

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/CustomerDashboard";

import CreateRequest from "./pages/CreateRequest";
import MovingItems from "./pages/MovingItems";
import VehicleSelection from "./pages/VehicleSelection";
import PriceEstimate from "./pages/PriceEstimate";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingDetails from "./pages/BookingDetails";
import TrackMyMove from "./pages/TrackMyMove";
import BookingHistory from "./pages/BookingHistory";
import Profile from "./pages/Profile";

import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import DriverAssignedMoves from "./pages/DriverAssignedMoves";
import DriverMoveDetails from "./pages/DriverMoveDetails";
import DriverUpdateStatus from "./pages/DriverUpdateStatus";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= CUSTOMER ROUTES ================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-move"
          element={<CreateRequest />}
        />

        <Route
          path="/moving-items"
          element={<MovingItems />}
        />

        <Route
          path="/vehicle-selection"
          element={<VehicleSelection />}
        />

        <Route
          path="/price-estimate"
          element={<PriceEstimate />}
        />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        <Route
          path="/booking-details"
          element={<BookingDetails />}
        />

        <Route
          path="/track-move"
          element={<TrackMyMove />}
        />

        <Route
          path="/booking-history"
          element={<BookingHistory />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ================= DRIVER ROUTES ================= */}

        <Route
          path="/driver-login"
          element={<DriverLogin />}
        />

        <Route
          path="/driver-dashboard"
          element={<DriverDashboard />}
        />

        <Route
          path="/driver-assigned-moves"
          element={<DriverAssignedMoves />}
        />

        <Route
          path="/driver-move-details"
          element={<DriverMoveDetails />}
        />

        <Route
          path="/driver-update-status"
          element={<DriverUpdateStatus />}
        />


        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />


        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;