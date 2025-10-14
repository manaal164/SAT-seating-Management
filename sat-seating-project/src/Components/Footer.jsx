import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2 className="footer-logo">SAT Enrolling Portal</h2>
          <p className="footer-text">
            Empowering students to achieve excellence through digital enrollment.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/student">Student Portal</a></li>
            <li><a href="/admin-login">Admin Login</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-right">
          <h3>Contact Us</h3>
          <p>Email: support@satportal.com</p>
          <p>Phone: +92 300 1234567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SAT Enrolling Portal | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
