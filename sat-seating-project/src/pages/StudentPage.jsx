




import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentPage() {
  const [rollNo, setRollNo] = useState("");
  const [fullName, setFullName] = useState("");   // ✅ Added full name
  const [selectedSeat, setSelectedSeat] = useState("");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [message, setMessage] = useState("");

  // Load available seats from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/seats/available")
      .then((res) => {
        console.log("Available seats from backend:", res.data);
        setAvailableSeats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching seats:", err);
      });
  }, []);

  // Handle student registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo || !fullName || !selectedSeat) {
      setMessage("⚠️ Please enter roll no, full name and select a seat");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/students", {
        roll_number: rollNo,
        full_name: fullName,         // ✅ send full name also
        seat_number: selectedSeat,
      });

      setMessage("✅ Student registered successfully!");
      setRollNo("");
      setFullName("");              // ✅ reset full name
      setSelectedSeat("");

      // refresh available seats after booking
      const updated = await axios.get("http://localhost:5000/api/seats/available");
      setAvailableSeats(updated.data);

    } catch (err) {
      console.error("❌ Error registering student:", err.response?.data || err.message);
      setMessage("❌ Error registering student");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Student Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Roll No input */}
        <div>
          <label className="block font-medium">Roll No</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter roll number"
          />
        </div>

        {/* Full Name input */}
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter full name"
          />
        </div>

        {/* Seat Dropdown */}
        <div>
          <label className="block font-medium">Select Seat</label>
          <select
            value={selectedSeat}
            onChange={(e) => setSelectedSeat(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">-- Select a seat --</option>
            {availableSeats.length > 0 ? (
              availableSeats.map((seat, idx) => (
                <option key={idx} value={seat.seat_number}>
                  {seat.seat_number}
                </option>
              ))
            ) : (
              <option disabled>No seats available</option>
            )}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default StudentPage;
