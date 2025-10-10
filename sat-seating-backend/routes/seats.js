const express = require("express");
const router = express.Router();
const db = require("../db");

/* ---------------------------------------------
   ✅ 1. Get ALL seats (with optional student info)
---------------------------------------------- */
router.get("/", (req, res) => {
  const query = `
    SELECT 
      s.id,
      s.seat_number,
      s.is_booked,
      s.booked_by_roll AS roll_number,
      s.booked_at,
      st.full_name
    FROM seats s
    LEFT JOIN students st ON s.booked_by_roll = st.roll_number
    ORDER BY s.id ASC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error GET /api/seats:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log(`✅ Seats fetched: ${results.length}`);
    res.json(results);
  });
});

/* ---------------------------------------------
   ✅ 2. Get only available seats
---------------------------------------------- */
router.get("/available", (req, res) => {
  db.query(
    "SELECT id, seat_number, is_booked FROM seats WHERE is_booked = 0 ORDER BY id LIMIT 2000",
    (err, results) => {
      if (err) {
        console.error("❌ Error GET /api/seats/available:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

/* ---------------------------------------------
   ✅ 3. Book a seat
---------------------------------------------- */
router.post("/book", (req, res) => {
  const { seat_number, roll_number } = req.body;
  if (!seat_number || !roll_number) {
    return res.status(400).json({ error: "Seat number and roll number required" });
  }

  db.query(
    "UPDATE seats SET is_booked = 1, booked_by_roll = ?, booked_at = NOW() WHERE seat_number = ? AND is_booked = 0",
    [roll_number, seat_number],
    (err, result) => {
      if (err) {
        console.error("❌ Error POST /api/seats/book:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(409).json({ error: "Seat already booked or not found" });
      }
      res.json({ message: "✅ Seat booked successfully" });
    }
  );
});

/* ---------------------------------------------
   ✅ 4. Withdraw a student's seat
---------------------------------------------- */
router.post("/withdraw", (req, res) => {
  const { seat_number, roll_number } = req.body;
  if (!seat_number || !roll_number) {
    return res.status(400).json({ error: "Seat number and roll number required" });
  }

  db.query("SELECT * FROM students WHERE roll_number = ?", [roll_number], (err, results) => {
    if (err) {
      console.error("❌ Error checking student:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No booking found for this student" });
    }

    // delete student booking record
    db.query("DELETE FROM students WHERE roll_number = ?", [roll_number], (delErr) => {
      if (delErr) {
        console.error("❌ Error deleting booking:", delErr);
        return res.status(500).json({ error: "Failed to withdraw booking" });
      }

      // release seat
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
    });
  });
});

/* ---------------------------------------------
   ✅ 5. Admin: Get all booked seats with student info
---------------------------------------------- */
router.get("/booked", (req, res) => {
  const query = `
    SELECT 
      s.id,
      s.seat_number,
      s.booked_by_roll AS roll_number,
      s.booked_at,
      st.full_name
    FROM seats s
    LEFT JOIN students st ON s.booked_by_roll = st.roll_number
    WHERE s.is_booked = 1
    ORDER BY s.booked_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error GET /api/seats/booked:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

/* ---------------------------------------------
   ✅ 6. Backup endpoint: Get all seats
---------------------------------------------- */
router.get("/all", (req, res) => {
  db.query("SELECT * FROM seats", (err, results) => {
    if (err) {
      console.error("❌ Error GET /api/seats/all:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
