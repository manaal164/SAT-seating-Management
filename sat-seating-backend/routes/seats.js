const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET all seats
router.get("/", (req, res) => {
  db.query("SELECT * FROM seats", (err, results) => {
    if (err) {
      console.error("Error GET /api/seats:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ GET available seats
router.get("/available", (req, res) => {
  db.query(
    "SELECT id, seat_number, is_booked FROM seats WHERE is_booked = 0 ORDER BY id LIMIT 2000",
    (err, results) => {
      if (err) {
        console.error("Error GET /api/seats/available:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// ✅ POST book a seat
router.post("/book", (req, res) => {
  const { seat_number, roll_number, full_name } = req.body;
  if (!seat_number || !roll_number || !full_name) {
    return res
      .status(400)
      .json({ error: "Seat number, roll number and full name required" });
  }

  // 1️⃣ Check if roll number already booked a seat
  db.query(
    "SELECT * FROM students WHERE roll_number = ?",
    [roll_number],
    (checkErr, existing) => {
      if (checkErr) {
        console.error("Error checking student:", checkErr);
        return res.status(500).json({ error: "Database error" });
      }

      if (existing.length > 0) {
        return res
          .status(400)
          .json({ error: "This student has already booked a seat" });
      }

      // 2️⃣ Insert student record
      db.query(
        "INSERT INTO students (full_name, roll_number, seat_number) VALUES (?, ?, ?)",
        [full_name, roll_number, seat_number],
        (insertErr) => {
          if (insertErr) {
            console.error("Error inserting student:", insertErr);
            return res.status(500).json({ error: "Database error" });
          }

          // 3️⃣ Update seat as booked
          db.query(
            "UPDATE seats SET is_booked = 1, booked_by_roll = ?, booked_at = NOW() WHERE seat_number = ? AND is_booked = 0",
            [roll_number, seat_number],
            (updateErr, result) => {
              if (updateErr) {
                console.error("Error updating seat:", updateErr);
                return res.status(500).json({ error: "Database error" });
              }
              if (result.affectedRows === 0) {
                return res
                  .status(409)
                  .json({ error: "Seat already booked or not found" });
              }
              res.json({ message: "Seat booked successfully" });
            }
          );
        }
      );
    }
  );
});

// ✅ Withdraw seat (student gives up their seat)
router.post("/withdraw", (req, res) => {
  const { seat_number, roll_number } = req.body;

  if (!seat_number || !roll_number) {
    return res
      .status(400)
      .json({ error: "Seat number and roll number required" });
  }

  // 1️⃣ Check if seat is booked by this student
  db.query(
    "SELECT * FROM seats WHERE seat_number = ? AND booked_by_roll = ? AND is_booked = 1",
    [seat_number, roll_number],
    (err, seatResults) => {
      if (err) {
        console.error("❌ Error checking seat booking:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (seatResults.length === 0) {
        return res
          .status(404)
          .json({ error: "No active booking found for this seat and student" });
      }

      // 2️⃣ Delete the student record and update seat status
      db.query(
        "DELETE FROM students WHERE roll_number = ?",
        [roll_number],
        (delErr) => {
          if (delErr) {
            console.error("❌ Error deleting student record:", delErr);
            return res.status(500).json({ error: "Failed to withdraw booking" });
          }

          db.query(
            "UPDATE seats SET is_booked = 0, booked_by_roll = NULL, booked_at = NULL WHERE seat_number = ?",
            [seat_number],
            (updateErr) => {
              if (updateErr) {
                console.error("❌ Error updating seat:", updateErr);
                return res.status(500).json({ error: "Failed to release seat" });
              }

              return res.json({ message: "✅ Seat withdrawn successfully!" });
            }
          );
        }
      );
    }
  );
});

// ✅ Admin: GET all booked seats with student names
router.get("/booked", (req, res) => {
  db.query(
    `SELECT s.seat_number, s.booked_by_roll, s.booked_at, st.full_name
     FROM seats s
     LEFT JOIN students st ON s.booked_by_roll = st.roll_number
     WHERE s.is_booked = 1
     ORDER BY s.booked_at DESC`,
    (err, results) => {
      if (err) {
        console.error("Error GET /api/seats/booked:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
