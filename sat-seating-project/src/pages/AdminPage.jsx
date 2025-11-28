import { useEffect, useState } from "react";
import api from "../api";

function AdminPage() {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [message, setMessage] = useState("");

  // Load booked seats
  const fetchBookedSeats = async () => {
    try {
      const res = await api.get("/seats/booked");
      setBookedSeats(res.data);
    } catch (err) {
      console.error("Error fetching booked seats:", err);
    }
  };

  useEffect(() => {
    fetchBookedSeats();
  }, []);

  const handleWithdraw = async (seat_number, roll_number) => {
    if (!window.confirm(`Withdraw seat ${seat_number} for Roll No ${roll_number}?`)) return;

    try {
      const res = await api.post("/seats/withdraw", { seat_number, roll_number });
      setMessage(res.data.message || "✅ Withdraw successful!");
      fetchBookedSeats();
    } catch (err) {
      setMessage("❌ Withdraw failed!");
    }
  };

  // 🌈 Inline CSS
  const styles = {
    pageWrapper: {
      height: "95vh",           // Full viewport
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      overflow: "hidden",        // Page scroll disable
      padding: "20px",
    },

    box: {
      background: "white",
      width: "95%",
      maxWidth: "1100px",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      height: "70vh",             // Fixed height
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",          // Container scrollable
      marginBottom: "-40px",
    },

    title: {
      fontSize: "28px",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "25px",
      color: "#1a1a1a",
    },

    message: {
      textAlign: "center",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "15px",
    },

    tableWrapper: {
      width: "100%",
      overflowX: "auto",
      borderRadius: "12px",
      border: "1px solid #dcdcdc",
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "15px",
    },

    th: {
      background: "#f4f4f4",
      color: "#333",
      padding: "12px",
      border: "1px solid #ddd",
      fontWeight: "600",
    },

    td: {
      padding: "12px",
      border: "1px solid #ddd",
      textAlign: "center",
      color: "#000",
    },

    withdrawBtn: {
      background: "#e63946",
      color: "white",
      padding: "8px 14px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.3s",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.box}>
        <h2 style={styles.title}>🛠 Admin Dashboard</h2>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("❌") ? "red" : "green",
            }}
          >
            {message}
          </p>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Seat Number</th>
                <th style={styles.th}>Roll Number</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Booked At</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookedSeats.length > 0 ? (
                bookedSeats.map((seat, idx) => (
                  <tr
                    key={idx}
                    style={{ transition: "0.3s" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#fafafa")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <td style={styles.td}>{seat.seat_number}</td>
                    <td style={styles.td}>{seat.roll_number}</td>
                    <td style={styles.td}>{seat.full_name || "—"}</td>
                    <td style={styles.td}>
                      {new Date(seat.booked_at).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() =>
                          handleWithdraw(seat.seat_number, seat.roll_number)
                        }
                        style={styles.withdrawBtn}
                        onMouseOver={(e) =>
                          (e.target.style.background = "#c9182b")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "#e63946")
                        }
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan="5">
                    No booked seats yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
