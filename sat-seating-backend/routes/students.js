const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all students
router.get("/", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// ✅ POST: Add student & book seat
router.post("/", (req, res) => {
  const { roll_number, full_name, seat_number } = req.body;

  if (!roll_number || !full_name || !seat_number) {
    return res
      .status(400)
      .json({ error: "Roll number, full name and seat number required" });
  }

  // Check if seat already booked
  db.query(
    "SELECT * FROM seats WHERE seat_number = ? AND is_booked = 1",
    [seat_number],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ error: "Seat already booked" });
      }

      // Add student record
      db.query(
        "INSERT INTO students (roll_number, full_name) VALUES (?, ?)",
        [roll_number, full_name],
        (err) => {
          if (err) {
            console.error("❌ Insert student error:", err);
            return res
              .status(500)
              .json({ error: "Database error inserting student" });
          }

          // Mark seat as booked
          db.query(
            "UPDATE seats SET is_booked = 1, booked_by_roll = ?, booked_at = NOW() WHERE seat_number = ?",
            [roll_number, seat_number],
            (err2) => {
              if (err2) {
                console.error("❌ Update seat error:", err2);
                return res
                  .status(500)
                  .json({ error: "Database error updating seat" });
              }

              res.json({
                message: "✅ Student registered and seat booked successfully",
              });
            }
          );
        }
      );
    }
  );
});

// ✅ GET student by roll number
router.get("/:roll_number", (req, res) => {
  const roll = req.params.roll_number;
  const sql = `
    SELECT st.id, st.roll_number, st.full_name, s.seat_number, s.is_booked, s.booked_at
    FROM students st
    LEFT JOIN seats s ON s.booked_by_roll = st.roll_number
    WHERE st.roll_number = ?
    LIMIT 1
  `;
  db.query(sql, [roll], (err, results) => {
    if (err) {
      console.error("❌ Error GET /api/students/:roll_number:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!results || results.length === 0) return res.json({});
    res.json(results[0]);
  });
});

// ✅ POST: Withdraw seat
router.post("/withdraw", (req, res) => {
  const { roll_number, seat_number } = req.body;

  if (!roll_number || !seat_number) {
    return res
      .status(400)
      .json({ error: "Roll number and seat number required" });
  }

  // Delete student + free seat
  db.query(
    "DELETE FROM students WHERE roll_number = ?",
    [roll_number],
    (err, result) => {
      if (err) {
        console.error("❌ Withdraw error:", err);
        return res.status(500).json({ error: "Database error withdrawing" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No booking found" });
      }

      db.query(
        "UPDATE seats SET is_booked = 0, booked_by_roll = NULL, booked_at = NULL WHERE seat_number = ?",
        [seat_number],
        (err2) => {
          if (err2) {
            console.error("❌ Seat release error:", err2);
            return res.status(500).json({ error: "Error releasing seat" });
          }

          res.json({ message: "✅ Seat withdrawn successfully" });
        }
      );
    }
  );
});

module.exports = router;
