import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function StudentPage() {
  const [rollNo, setRollNo] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [seats, setSeats] = useState([]);
  const [message, setMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();

  // Fetch seats
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/seats");
        const seatsData = res.data.map((seat) => ({
          ...seat,
          is_booked: seat.is_booked === 1 || seat.is_booked === true,
        }));
        setSeats(seatsData);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setMessage("⚠️ Error loading seats from server");
      }
    };
    fetchSeats();
  }, []);

  // Check existing booking
  useEffect(() => {
    if (!rollNo) return;
    const checkExistingBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${rollNo}`);
        if (res.data && res.data.seat_number) {
          setIsBooked(true);
          setSelectedSeat(res.data.seat_number);
          setFullName(res.data.full_name || "");
          setMessage(`ℹ️ You already booked Seat ${res.data.seat_number}`);
        } else {
          setIsBooked(false);
          setSelectedSeat("");
          setFullName("");
        }
      } catch {
        setIsBooked(false);
        setSelectedSeat("");
        setFullName("");
      }
    };
    checkExistingBooking();
  }, [rollNo]);

  // Book a seat
  const handleBook = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!rollNo || !fullName || !selectedSeat) {
      setMessage("⚠️ Please enter Roll No, Full Name, and select a Seat");
      return;
    }

    try {
      const payload = { roll_number: rollNo, full_name: fullName, seat_number: selectedSeat };
      await axios.post("http://localhost:5000/api/students", payload);
      setIsBooked(true);
      setMessage("✅ Seat booked successfully!");
      navigate("/receipt", {
        state: {
          booking: {
            student_name: fullName,
            roll_no: rollNo,
            seat_number: selectedSeat,
            booking_time: new Date().toLocaleString(),
          },
        },
      });
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Booking failed");
    }
  };

  // Withdraw seat
  const handleWithdraw = async () => {
    setMessage("");
    if (!rollNo || !selectedSeat) {
      setMessage("⚠️ Enter Roll No and Seat Number to withdraw");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/students/withdraw", {
        roll_number: rollNo,
        seat_number: selectedSeat,
      });
      setMessage("🪑 Seat withdrawn successfully!");
      setIsBooked(false);
      setSelectedSeat("");
      setFullName("");
      const refresh = await axios.get("http://localhost:5000/api/seats");
      const seatsData = refresh.data.map((seat) => ({
        ...seat,
        is_booked: seat.is_booked === 1 || seat.is_booked === true,
      }));
      setSeats(seatsData);
    } catch (err) {
      console.error("Withdraw error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Withdraw failed");
    }
  };

  // Inline CSS (AdminPage style inspired)
  const styles = {
    pageWrapper: {
      Height: "90vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: "transparent",
      paddingTop: "var(--nav-height, 70px)",
      paddingBottom: "20px",
    },
    box: {
      background: "white",
      width: "95%",
      maxWidth: "600px",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      overflowY: "auto",
      maxHeight: "80vh",
      marginBottom: "-20px",
    },
    title: {
      fontSize: "26px",
      fontWeight: "700",
      textAlign: "center",
      color: "#1a1a1a",
    },
    label: {
      fontWeight: "600",
      marginBottom: "6px",
      color: "#1a1a1a",
    },
    input: {
      width: "95%",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #c9c9c9",
      fontSize: "15px",
      outline: "none",
      backgroundColor: "#1a1a1a",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #c9c9c9",
      fontSize: "15px",
      outline: "none",
      background: "white",
      color: "#c9c9c9",
      transition: "all 0.9s ease-in-out",
      backgroundColor: "#1a1a1a",
      
    },
    button: {
      padding: "12px 20px",
      fontWeight: "600",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "0.3s",
    },
    bookBtn: {
      background: "#1a73e8",
      color: "white",
    },
    withdrawBtn: {
      background: "#e63946",
      color: "white",
    },
    message: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: "15px",
      color: "#1a1a1a",
    },
  };

  return (
    <>
      <Navbar />
      <div style={styles.pageWrapper}>
        <div style={styles.box}>
          <h2 style={styles.title}>🎓 Student Seat Booking Portal</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={styles.label}>Roll No</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                style={styles.input}
                disabled={isBooked}
              />
            </div>

            <div>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                disabled={isBooked}
              />
            </div>

            <div>
              <label style={styles.label}>Select Seat</label>
              <select
                style={styles.select}
                value={selectedSeat}
                onChange={(e) => setSelectedSeat(e.target.value)}
                disabled={isBooked}
              >
                <option value="" disabled>
                  Select Seat
                </option>
                {seats
                  .filter((seat) => !seat.is_booked || seat.seat_number === selectedSeat)
                  .map((seat) => (
                    <option key={seat.id} value={seat.seat_number}>
                      {seat.seat_number}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
              {!isBooked ? (
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.bookBtn }}
                  onClick={handleBook}
                  disabled={!rollNo || !fullName || !selectedSeat}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#155ab6")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "#1a73e8")}

                >
                  Register & Book Seat
                </button>
              ) : (
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.withdrawBtn }}
                  onClick={handleWithdraw}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#c9182b")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "#e63946")}

                >
                  Withdraw Seat
                </button>
              )}
            </div>

            {message && <p style={styles.message}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentPage;
