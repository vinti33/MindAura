import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

// --- Custom Hook for Quote Rotation ---
const useQuoteRotator = (quotes, interval = 5000) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, interval);

    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  return quotes[currentQuoteIndex];
};

const inspirationalQuotes = [
  "Peace comes from within. Do not seek it without.",
  "Every day is a new beginning.",
  "Your mind is a garden. Your thoughts are the seeds.",
  "Calm mind brings inner strength and self-confidence.",
  "Happiness is not something ready made. It comes from your own actions.",
];

function Home() {
  const navigate = useNavigate();
  const currentQuote = useQuoteRotator(inspirationalQuotes, 6000);

  return (
    <div className="home-container">
      <div className="overlay"></div>

      <div className="home-content">
        <h1 className="home-title">🧘 Mind Aura</h1>
        <p className="home-subtitle">
          Track your mind. Heal your soul. Explore your emotions and find calm.
        </p>

        <div className="home-quote">
          <span>"{currentQuote}"</span>
        </div>

        <div className="home-buttons">
          <button onClick={() => navigate("/signup")} className="btn primary-btn">
            Signup
          </button>

          <button onClick={() => navigate("/login")} className="btn secondary-btn">
            Login
          </button>
        </div>
      </div>

      <div className="floating-shapes">
        <span className="shape circle"></span>
        <span className="shape triangle"></span>
        <span className="shape square"></span>
      </div>
    </div>
  );
}

export default Home;
