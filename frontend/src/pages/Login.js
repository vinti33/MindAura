import { API_BASE_URL } from "../api";  
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/auth.css";


function Login() {
  const navigate = useNavigate(); // ✅ Added navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      // API call for real login (replaced URL with backend)
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      setMessage(res.data.message || "Login successful!");

      // Optionally, store token or user data in localStorage
      // localStorage.setItem("token", res.data.token);
      localStorage.setItem("token", res.data.token);
      // Redirect to Dashboard
      navigate("/dashboard");

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>

          {/* Display message */}
          {message && <p className="auth-message">{message}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="auth-buttons">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>

          <p className="auth-signup-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign up here</span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;

