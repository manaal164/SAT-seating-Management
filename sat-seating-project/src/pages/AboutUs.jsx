import React from "react";

const AboutUs = () => {
  // Inline CSS style
  const styles = {
    pageWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      Height: "90vh",
      background: "transparent",
      paddingTop: "var(--nav-height, 70px)",
      paddingBottom: "20px",
    },
    box: {
      background: "#fff",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      maxWidth: "800px",
      width: "95%",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a1a1a",
      textAlign: "center",
    },
    text: {
      fontSize: "16px",
      color: "#333",
      lineHeight: "1.8",
      textAlign: "justify",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.box}>
        <h2 style={styles.title}>About Us</h2>
        <p style={styles.text}>
          Welcome to our Student Seat Booking Portal! 🎓  
          This platform is designed to help students easily book and manage their seats for exams or events.  
          Our mission is to make the seat booking process simple, fast, and reliable.  
          We strive to provide a seamless experience for all students while ensuring accuracy and transparency in seat allocation.
        </p>
        <p style={styles.text}>
          This system is built with React on the frontend and Node.js/Express on the backend, using a modern microservices architecture.  
          We aim to provide students and administrators with tools that are intuitive and user-friendly.  
          Thank you for trusting us with your seat booking needs!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
