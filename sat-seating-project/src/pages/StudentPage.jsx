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

  // Render seat map
  const renderSeatMap = () => {
    if (!seats || seats.length === 0) return <p>Loading seat map...</p>;
    const rows = {};
    seats.forEach((seat) => {
      const rowLetter = seat.seat_number.charAt(0).toUpperCase();
      if (!rows[rowLetter]) rows[rowLetter] = [];
      rows[rowLetter].push(seat);
    });

    return (
      <div className="flex flex-col gap-1 items-start w-full">
        {Object.keys(rows)
          .sort()
          .map((row) => (
            <div key={row} className="flex gap-1 items-start w-full">
              <span className="w-3 text-[10px] font-bold text-gray-600 shrink-0 mt-1">{row}</span>
              <div className="w-full">
                {rows[row]
                  .sort(
                    (a, b) => parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1))
                  )
                  .map((seat) => (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() =>
                        !seat.is_booked && !isBooked && setSelectedSeat(seat.seat_number)
                      }
                      disabled={seat.is_booked || isBooked}
                      className={`text-white font-medium rounded-sm border transition-all duration-150 ${
                        seat.seat_number === selectedSeat
                          ? "bg-yellow-400 border-yellow-600 shadow-sm"
                          : seat.is_booked
                          ? "bg-red-500 border-red-700 opacity-70 cursor-not-allowed"
                          : "bg-green-500 border-green-700 hover:bg-green-400"
                      }`}
                      style={{
                        width: "20px",
                        height: "20px",
                        fontSize: "8px",
                        marginRight: "2px",
                        marginBottom: "2px",
                        display: "inline-block",
                        textAlign: "center",
                        lineHeight: "20px",
                        padding: 0,
                      }}
                      title={seat.seat_number}
                    >
                      {seat.seat_number.slice(1)}
                    </button>
                  ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      {/* ✅ Added padding equal to navbar height (prevents overlap) */}
      <div style={{ paddingTop: "var(--nav-height)" }} className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mt-2">
          <h2 className="text-xl font-bold mb-4 text-center">🎓 Student Seat Booking Portal</h2>

          <form onSubmit={handleBook} className="space-y-4">
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

            <div className="mb-4 flex justify-center">
              <div className="flex flex-col items-center w-full max-w-xs">
                <div className="flex justify-center gap-2 text-xs mb-2 p-1.5 bg-gray-100 rounded-lg w-full font-medium">
                  <span className="flex items-center gap-1">
                    <div className="bg-green-500 w-4 h-4 rounded-sm"></div> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="bg-red-500 w-4 h-4 rounded-sm opacity-70"></div> Booked
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="bg-yellow-400 w-4 h-4 rounded-sm"></div> Selected
                  </span>
                </div>

                <label className="block font-medium mb-2 w-full text-center">Select a Seat</label>

                <div
                  className="p-3 border rounded-lg bg-white max-h-60 overflow-y-scroll w-full shadow-inner"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {renderSeatMap()}
                </div>

                <p className="mt-2 text-sm font-semibold">
                  Current Selection:{" "}
                  <span className="text-blue-600">{selectedSeat || "None"}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-2">
              {!isBooked ? (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 disabled:opacity-50"
                  disabled={!selectedSeat || !rollNo || !fullName}
                >
                  Register & Book Seat {selectedSeat ? `(${selectedSeat})` : ""}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-150"
                >
                  Withdraw Seat {selectedSeat ? `(${selectedSeat})` : ""}
                </button>
              )}
            </div>
          </form>

          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default StudentPage;
