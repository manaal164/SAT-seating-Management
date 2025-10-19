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

  // Render seat list (simple scroll selector)
  const renderSeatList = () => (
    <select
      className="border p-2 rounded w-full bg-white"
      value={selectedSeat}
      onChange={(e) => setSelectedSeat(e.target.value)}
      disabled={isBooked}
    >
      <option value="">Select a Seat</option>
      {seats
        .filter((seat) => !seat.is_booked || seat.seat_number === selectedSeat)
        .map((seat) => (
          <option key={seat.id} value={seat.seat_number}>
            {seat.seat_number}
          </option>
        ))}
    </select>
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "var(--nav-height)" }} className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg mt-6">
          <h2 className="text-2xl font-bold mb-6 text-center !text-black
">
            🎓 Student Seat Booking Portal
          </h2>

          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="block text-black font-bold mb-1">Roll No</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Enter Roll Number"
                disabled={isBooked}
              />
            </div>

            <div>
              <label className="block text-black font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Enter Full Name"
                disabled={isBooked}
              />
            </div>

            <div>
              <label className="block text-black font-bold mb-1">Select Seat</label>
              {renderSeatList()}
            </div>

            <div className="flex justify-center gap-3 mt-4">
              {!isBooked ? (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition duration-150 disabled:opacity-50"
                  disabled={!selectedSeat || !rollNo || !fullName}
                >
                  Register & Book Seat
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition duration-150"
                >
                  Withdraw Seat
                </button>
              )}
            </div>
          </form>

          {message && <p className="mt-5 text-center text-sm">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default StudentPage;
