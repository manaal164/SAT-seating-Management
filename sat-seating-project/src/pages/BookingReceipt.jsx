import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const BookingReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <h2>No booking data found!</h2>
        <button
          onClick={() => navigate("/student")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Seat Booking Receipt", 70, 20);
    doc.setFontSize(12);
    doc.text(`Student Name: ${booking.student_name}`, 20, 40);
    doc.text(`Roll Number: ${booking.roll_no}`, 20, 50);
    doc.text(`Seat Number: ${booking.seat_number}`, 20, 60);
    doc.text(`Booking Date: ${booking.booking_time}`, 20, 70);
    doc.text("Thank you for booking your seat!", 20, 90);
    doc.save(`Seat_Booking_${booking.roll_no}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Confirmation</h1>
        <p><strong>Student Name:</strong> {booking.student_name}</p>
        <p><strong>Roll Number:</strong> {booking.roll_no}</p>
        <p><strong>Seat Number:</strong> {booking.seat_number}</p>
        <p><strong>Booking Time:</strong> {booking.booking_time}</p>

        <button
          onClick={handleDownloadPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-6"
        >
          Download as PDF
        </button>

        <button
          onClick={() => navigate("/student")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
        >
          Go Back to Student Portal
        </button>
      </div>
    </div>
  );
};

export default BookingReceipt;
