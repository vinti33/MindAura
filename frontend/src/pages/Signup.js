import { API_BASE_URL } from "../api";
import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Update user state when input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: simple frontend validation
    if (!user.name || !user.email || !user.password) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {

      // DEBUG: Check the API URL and user data
    console.log("API URL:", `${API_BASE_URL}/api/auth/signup`);
    console.log("User data being sent:", user);
      // Call backend API to create user
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, user);

      setMessage(res.data.message || "Signup successful!");

      // Store token returned from backend
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      // Redirect to Dashboard (or Login page depending on flow)
      navigate("/dashboard"); // After signup, go directly to dashboard

    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {/* Display message */}
        {message && <p className="auth-message">{message}</p>}

        {/* Input fields */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />

        {/* Signup button */}
        <div className="auth-buttons">
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </div>

        {/* Link to Login */}
        <p className="auth-login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;

