import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./HomePage.css";
import Navbar from "../Components/Navbar";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />
      <div className="container">
        <h1>Welcome to SAT Enrolling Portal</h1>
        <button className="student" onClick={() => navigate("/student")}>
          Student Portal
        </button>
        <button className="admin" onClick={() => navigate("/admin-login")}>
          Admin Portal
        </button>
      </div>
     
    </div>
  );
}

export default Homepage;
