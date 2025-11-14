import { API_BASE_URL } from "../api";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/trends.css";

// Assuming this is the data structure you are now using from your backend
const StatCard = ({ title, value }) => (
    <div className="stat-card">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
    </div>
);

// Helper for the timeline items (for better structure and animation targeting)
const MoodTimelineItem = ({ moodEntry, index }) => {
    const date = new Date(moodEntry.date).toLocaleDateString();
    // Use index for animation staggering
    const style = { animationDelay: `${index * 0.15}s` };
    
    // We'll use a specific CSS class (mood-dot) for the colored circles
    return (
        <div className="mood-timeline-item fade-in-up" style={style}>
            <div className="item-content">
                <span className="mood-date">{date}</span>
                <span className={`mood-label mood-${moodEntry.mood.toLowerCase()}`}>
                    <span className="mood-dot"></span>
                    {moodEntry.mood}
                </span>
            </div>
        </div>
    );
};


function Trends() {
    const [trendsData, setTrendsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                // Assuming you've fixed the auth error or removed the header for testing
                const res = await axios.get(`${API_BASE_URL}/api/moods/trends`); 
                
                // Use default data structure if backend returns empty for initial safety
                const data = res.data || {
                    totalEntries: 0, longestStreak: 0, mostCommonMood: "N/A", 
                    moods: [] 
                };
                setTrendsData(data);
            } catch (err) {
                console.error("Failed to fetch trends", err);
                setError("Failed to load trends.");
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    // --- Loading and Error States ---
    if (loading) return <div className="trends-container loading-state">Loading Aura Data...</div>;
    if (error) return <div className="trends-container error-state">{error}</div>;
    
    // Extract data safely
    const { totalEntries, longestStreak, mostCommonMood, moods } = trendsData;

    return (
        <div className="trends-container">
            <header className="trends-header pop-in-header">
                <span className="header-icon">🌤️</span> {/* Sun/Cloud Icon */}
                <h1>Your Mood Journey</h1>
            </header>

            {/* 1. Stats Grid (Cards) */}
            <section className="stats-grid">
                <StatCard title="Total Entries" value={totalEntries} />
                <StatCard title="Longest Streak" value={`${longestStreak} days`} />
                <StatCard title="Most Common Mood" value={mostCommonMood || '—'} />
            </section>

            {/* 2. Recent Mood Timeline */}
            <section className="timeline-section">
                <h2 className="timeline-title fade-in-title">
                    <span className="rainbow-icon">🌈</span> Recent Mood Timeline
                </h2>
                <div className="mood-timeline">
                    {moods?.slice().reverse().map((m, index) => (
    <MoodTimelineItem key={index} moodEntry={m} index={index} />
                    ))}
                    {moods?.length === 0 && <p className="no-data-msg">Log your first mood to see the timeline!</p>}
                </div>
            </section>

            {/* 3. Back Button with Animation */}
            <div className="trends-footer">
                <button 
                    className="back-to-dashboard-btn pulse-button" 
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default Trends;