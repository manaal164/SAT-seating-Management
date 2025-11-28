import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import BookingReceipt from "./pages/BookingReceipt";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";


function App() {
  return (
    <Router>
      <div id="app" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: "1" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/receipt" element={<BookingReceipt />} />
            <Route path="/about" element={<About />} />       {/* Add About */}
            <Route path="/contact" element={<Contact />} />   {/* Add Contact */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
