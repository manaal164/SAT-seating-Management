import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentPage() {
  const [rollNo, setRollNo] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [message, setMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  // ✅ Fetch all available seats
  const fetchSeats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/seats/available");
      setAvailableSeats(res.data);
    } catch (err) {
      console.error("Error fetching seats:", err);
      setMessage("⚠️ Error loading seats from server");
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  // ✅ Book a seat
  const handleBook = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!rollNo || !fullName || !selectedSeat) {
      setMessage("⚠️ Please enter Roll No, Full Name, and select a Seat");
      return;
    }

    try {
      const payload = {
        roll_number: rollNo,
        full_name: fullName,
        seat_number: selectedSeat,
      };

      const res = await axios.post("http://localhost:5000/api/students", payload);
      console.log("Booking response:", res.data);

      setMessage("✅ Seat booked successfully!");
      setIsBooked(true);
      await fetchSeats();
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Booking failed");
    }
  };

  // ✅ Withdraw seat
  const handleWithdraw = async () => {
    setMessage("");

    if (!rollNo || !selectedSeat) {
      setMessage("⚠️ Enter Roll No and Seat Number to withdraw");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/students/withdraw", {
        roll_number: rollNo,
        seat_number: selectedSeat,
      });
      console.log("Withdraw response:", res.data);

      setMessage("🪑 Seat withdrawn successfully!");
      setIsBooked(false);
      setSelectedSeat("");
      setFullName("");
      await fetchSeats();
    } catch (err) {
      console.error("Withdraw error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Withdraw failed");
    }
  };

  // ✅ Check if student already booked a seat
  const checkExistingBooking = async (roll) => {
    if (!roll) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${roll}`);
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
    } catch (err) {
      setIsBooked(false);
      setSelectedSeat("");
      setFullName("");
    }
  };

  useEffect(() => {
    checkExistingBooking(rollNo);
  }, [rollNo]);

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          🎓 Student Seat Booking Portal
        </h2>

        {/* Form */}
        <form onSubmit={handleBook} className="space-y-4">
          {/* Roll No */}
          <div>
            <label className="block font-medium">Roll No</label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter Roll Number"
              disabled={isBooked}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter Full Name"
              disabled={isBooked}
            />
          </div>

          {/* Seat Selection */}
          <div>
            <label className="block font-medium">Select Seat</label>
            <select
              value={selectedSeat}
              onChange={(e) => setSelectedSeat(e.target.value)}
              className="border p-2 w-full rounded"
              disabled={isBooked}
            >
              <option value="">-- Select a Seat --</option>
              {availableSeats.length > 0 ? (
                availableSeats.map((seat) => (
                  <option key={seat.id} value={seat.seat_number}>
                    {seat.seat_number}
                  </option>
                ))
              ) : (
                <option disabled>No seats available</option>
              )}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            {!isBooked ? (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Register & Book
              </button>
            ) : (
              <button
                type="button"
                onClick={handleWithdraw}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Withdraw Seat
              </button>
            )}
          </div>
        </form>

        {/* Message */}
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default StudentPage;
