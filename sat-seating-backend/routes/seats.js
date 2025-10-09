// sat-seating-backend/routes/seats.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all seats
router.get("/", (req, res) => {
  db.query("SELECT * FROM seats", (err, results) => {
    if (err) {
      console.error("Error GET /api/seats:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET available seats
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

// POST book a seat
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
        console.error("Error POST /api/seats/book:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(409).json({ error: "Seat already booked or not found" });
      }
      res.json({ message: "Seat booked successfully" });
    }
  );
});

// POST withdraw a booked seat (only the student who booked it can withdraw)
router.post("/withdraw", (req, res) => {
  const { seat_number, roll_number } = req.body;
  if (!seat_number || !roll_number) {
    return res.status(400).json({ error: "Seat number and roll number required" });
  }

  // Start transaction
  db.beginTransaction((txErr) => {
    if (txErr) {
      console.error("Transaction start error:", txErr);
      return res.status(500).json({ error: "Database transaction error" });
    }

    // 1) check seat exists and is booked
    db.query(
      "SELECT id, seat_number, booked_by_roll FROM seats WHERE seat_number = ? AND is_booked = 1 FOR UPDATE",
      [seat_number],
      (selErr, selRows) => {
        if (selErr) {
          console.error("Error selecting seat for withdraw:", selErr);
          return db.rollback(() => res.status(500).json({ error: "Database error" }));
        }

        if (!selRows || selRows.length === 0) {
          return db.rollback(() => res.status(400).json({ error: "Seat is not currently booked" }));
        }

        const seatRow = selRows[0];
        if (seatRow.booked_by_roll !== roll_number) {
          return db.rollback(() => res.status(403).json({ error: "You can only withdraw seats booked by your roll number" }));
        }

        // 2) update seats table to free seat
        db.query(
          "UPDATE seats SET is_booked = 0, booked_by_roll = NULL, booked_at = NULL WHERE seat_number = ?",
          [seat_number],
          (updErr, updRes) => {
            if (updErr) {
              console.error("Error updating seats on withdraw:", updErr);
              return db.rollback(() => res.status(500).json({ error: "Database error updating seat" }));
            }

            // 3) try to update students table to remove seat reference (if column exists).
            db.query(
              "UPDATE students SET seat_number = NULL WHERE roll_number = ?",
              [roll_number],
              (stuErr) => {
                if (stuErr) {
                  // If `seat_number` column doesn't exist, skip but continue the transaction.
                  // ER_BAD_FIELD_ERROR occurs when column doesn't exist.
                  if (stuErr.code === "ER_BAD_FIELD_ERROR") {
                    console.warn("students.seat_number not present — skipping students update (this is safe)");
                  } else {
                    console.error("Error updating students during withdraw:", stuErr);
                    return db.rollback(() => res.status(500).json({ error: "Database error updating student", details: stuErr }));
                  }
                }

                // 4) optionally insert booking history (if bookings table exists)
                db.query(
                  "INSERT INTO bookings (seat_id, roll_number, action) VALUES (?, ?, 'withdraw')",
                  [seatRow.id, roll_number],
                  (bkErr) => {
                    if (bkErr) {
                      // if bookings table doesn't exist, ignore and continue
                      if (bkErr.code === "ER_NO_SUCH_TABLE") {
                        console.warn("bookings table missing — skipping booking history insert");
                      } else {
                        console.warn("Warning: failed to insert into bookings:", bkErr);
                        // not fatal — continue
                      }
                    }

                    // Commit transaction
                    db.commit((cErr) => {
                      if (cErr) {
                        console.error("Commit error on withdraw:", cErr);
                        return db.rollback(() => res.status(500).json({ error: "Commit failed", details: cErr }));
                      }
                      return res.json({ message: "Seat withdrawn successfully" });
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// GET booked seats (admin view) - include student full name if available
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
