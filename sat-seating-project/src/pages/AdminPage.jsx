import { useEffect, useState } from "react";
import api from "../api";

function AdminPage() {
  const [bookedSeats, setBookedSeats] = useState([]);

  // Fetch booked seats
  useEffect(() => {
    api.get("/seats/booked")   // 🔥 correct endpoint (not /bookings/booked)
      .then(res => {
        console.log("📌 Booked seats:", res.data); // Debug log
        setBookedSeats(res.data);
      })
      .catch(err => console.error("Error fetching booked seats:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🛠 Admin Dashboard
        </h2>

        <table className="w-full border-collapse border border-gray-300 shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3">Seat Number</th>
              <th className="border p-3">Roll Number</th>
              <th className="border p-3">Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookedSeats.map((seat, idx) => (
              <tr key={idx} className="text-center">
                <td className="border p-3">{seat.seat_number}</td>
                <td className="border p-3">{seat.booked_by_roll}</td>
                <td className="border p-3">{seat.booked_at}</td>
              </tr>
            ))}

            {bookedSeats.length === 0 && (
              <tr>
                <td colSpan="3" className="text-gray-500 p-4 italic">
                  No booked seats yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
