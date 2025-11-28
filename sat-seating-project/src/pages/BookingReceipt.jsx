import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const BookingReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f0f0" }}>
        <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0px 10px 25px rgba(0,0,0,0.15)", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#e63946", marginBottom: "20px" }}>No booking data found!</h2>
          <button
            onClick={() => navigate("/student")}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "#1a73e8",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#155ab6")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1a73e8")}
          >
            Go Back
          </button>
        </div>
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

  // Inline CSS styles
  const styles = {
    pageWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      Height: "90vh",
      background: "transparent",
      padding: "20px",
    },
    box: {
      background: "#fff",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      textAlign: "center",
      width: "100%",
      maxWidth: "500px",
      marginBottom: "-40px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#1a1a1a",
    },
    infoText: {
      textAlign: "left",
      marginBottom: "15px",
      fontSize: "15px",
      color: "#1a1a1a",
      lineHeight: "1.6",
    },
    button: {
      padding: "12px 20px",
      borderRadius: "10px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
      marginTop: "10px",
    },
    downloadBtn: {
      background: "#28a745",
      color: "#fff",
    },
    backBtn: {
      background: "#1a73e8",
      color: "#fff",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.box}>
        <h1 style={styles.title}>🎓 Booking Confirmation</h1>

        <div style={styles.infoText}>
          <p><strong>Student Name:</strong> {booking.student_name}</p>
          <p><strong>Roll Number:</strong> {booking.roll_no}</p>
          <p><strong>Seat Number:</strong> {booking.seat_number}</p>
          <p><strong>Booking Time:</strong> {booking.booking_time}</p>
        </div>

        <button
          style={{ ...styles.button, ...styles.downloadBtn }}
          onClick={handleDownloadPDF}
          onMouseOver={(e) => (e.currentTarget.style.background = "#218838")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#28a745")}
        >
          Download as PDF
        </button>

        <button
          style={{ ...styles.button, ...styles.backBtn }}
          onClick={() => navigate("/student")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#155ab6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#1a73e8")}
        >
          Go Back to Student Portal
        </button>
      </div>
    </div>
  );
};

export default BookingReceipt;
