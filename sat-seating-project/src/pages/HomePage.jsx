import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./HomePage.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />

      <div className="homepage-container">
        <h1 className="homepage-title">" Welcome to SAT Portal "  Your Path Starts Here</h1>

        <div className="homepage-btn-group">
          <button
            className="homepage-btn student-btn"
            onClick={() => navigate("/student")}
          >
            Student Portal
          </button>

          <button
            className="homepage-btn admin-btn"
            onClick={() => navigate("/admin-login")}
          >
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
