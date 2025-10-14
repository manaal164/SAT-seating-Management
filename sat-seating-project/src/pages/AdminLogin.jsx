import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; // ✅ Import your existing Navbar

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

  return (
    <>
      {/* ✅ Navbar added */}
      <Navbar />

      {/* ✅ Added top padding so navbar doesn’t overlap */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 pt-16">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🔐 Admin Login
          </h2>

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
