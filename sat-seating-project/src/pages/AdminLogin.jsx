import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "admin123") {
      navigate("/admin");
    } else {
      alert("❌ Wrong password, try again!");
    }
  };

  // 🔥 Internal CSS object
  const styles = {
    pageWrapper: {
      height: "70vh", // navbar ke liye 70px minus
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      overflow: "hidden",           // <-- yahin scroll disable ho raha
    },
    box: {
      background: "white",
      width: "90%",
      maxWidth: "380px",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
    },
    title: {
      fontSize: "26px",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "20px",
      color: "#1a1a1a",
    },
    input: {
      width: "90%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #c9c9c9",
      outline: "none",
      marginBottom: "15px",
      fontSize: "15px",
    },
    button: {
      width: "100%",
      padding: "13px",
      borderRadius: "10px",
      background: "#1a1a1a",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      transition: "0.3s",
    },
  };

  return (
    <>
      <Navbar />

      {/* Entire page wrapper */}
      <div style={styles.pageWrapper}>
        {/* White Login Box */}
        <div style={styles.box}>
          <h2 style={styles.title}>🔐 Admin Login</h2>

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleLogin}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = "#000")}
            onMouseOut={(e) => (e.target.style.background = "#1a1a1a")}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
