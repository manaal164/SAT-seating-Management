const express = require("express");
const router = express.Router();
const db = require("../db");

// GET booking history
router.get("/", (req, res) => {
  db.query("SELECT * FROM bookings ORDER BY action_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// POST add booking action (book/withdraw)
router.post("/", (req, res) => {
  const { seat_id, roll_number, action } = req.body;

  if (!seat_id || !action) {
    return res.status(400).json({ error: "Seat ID and action required" });
  }

  db.query(
    "INSERT INTO bookings (seat_id, roll_number, action) VALUES (?, ?, ?)",
    [seat_id, roll_number, action],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Booking history updated", id: result.insertId });
    }
  );
});

module.exports = router;
