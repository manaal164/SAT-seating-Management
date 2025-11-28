import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <h2 className="footer-logo">SAT Enrolling Portal</h2>
          <p className="footer-text">
            Empowering students towards digital excellence.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/student">Student Portal</Link></li>
            <li><Link to="/admin-login">Admin Login</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-right">
          <h3>Contact Us</h3>
          <p>Email: support@satportal.com</p>
          <p>Phone: +92 300 1234567</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SAT Enrolling Portal — All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
