import { useEffect, useState } from "react";
import api from "../api";

function AdminPage() {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch booked seats with full_name
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

  // ✅ Handle admin withdrawal of a student's seat
  const handleWithdraw = async (seat_number, roll_number) => {
    if (!window.confirm(`Withdraw seat ${seat_number} for Roll No ${roll_number}?`)) return;
    setMessage("");

    try {
      const res = await api.post("/seats/withdraw", {
        seat_number,
        roll_number,
      });
      setMessage(res.data.message || "✅ Withdrawn successfully!");
      await fetchBookedSeats(); // refresh list
    } catch (err) {
      console.error("Withdraw error:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Withdraw failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🛠 Admin Dashboard
        </h2>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <table className="w-full border-collapse border border-gray-300 shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3">Seat Number</th>
              <th className="border p-3">Roll Number</th>
              <th className="border p-3">Full Name</th>
              <th className="border p-3">Booked At</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookedSeats.length > 0 ? (
              bookedSeats.map((seat, idx) => (
                <tr key={idx} className="text-center hover:bg-gray-50">
                  <td className="border p-3">{seat.seat_number}</td>
                  <td className="border p-3">{seat.booked_by_roll}</td>
                  <td className="border p-3">{seat.full_name || "—"}</td>
                  <td className="border p-3">
                    {new Date(seat.booked_at).toLocaleString()}
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() =>
                        handleWithdraw(seat.seat_number, seat.booked_by_roll)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-gray-500 p-4 italic">
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
