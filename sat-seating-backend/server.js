const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Database connection
const db = require("./db");

// Import Routes
const seatRoutes = require("./routes/seats");
const studentRoutes = require("./routes/students");
const bookingRoutes = require("./routes/bookings");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================== Routes ================== //
app.use("/api/seats", seatRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running...");
});

// ================== Server ================== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
