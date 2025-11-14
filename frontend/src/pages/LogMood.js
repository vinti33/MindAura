import { API_BASE_URL } from "../api";  
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/logmood.css';
import { Smile, Frown, Meh, Zap, Heart, Cloud, XCircle, Loader } from 'react-feather';

// Define the available mood options dynamically
const moodOptions = [
    { key: 'happy', label: 'Happy', icon: Smile, color: '#4ade80' },    // Green
    { key: 'calm', label: 'Calm', icon: Cloud, color: '#60a5fa' },     // Blue
    { key: 'energetic', label: 'Energetic', icon: Zap, color: '#fcd34d' },// Yellow
    { key: 'anxious', label: 'Anxious', icon: XCircle, color: '#f87171' },// Red/Orange
    { key: 'sad', label: 'Sad', icon: Frown, color: '#9ca3af' },      // Gray
    { key: 'loved', label: 'Loved', icon: Heart, color: '#f472b6' },    // Pink
    { key: 'neutral', label: 'Neutral', icon: Meh, color: '#e5e7eb' },  // Light Gray
];

function LogMood() {
    const navigate = useNavigate();
    
    // State adapted to the icon selection model
    const [selectedMoodKey, setSelectedMoodKey] = useState(null); 
    const [notes, setNotes] = useState(''); // Added field for journal entry
    
    // State for API feedback, matching your structure
    const [message, setMessage] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    // Helper to get the full mood object for payload
    const selectedMood = moodOptions.find(opt => opt.key === selectedMoodKey);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🚨 Validation adapted to selected key
        if (!selectedMoodKey) {
            setMessage({ type: 'error', text: "Please select a mood option." });
            return;
        }

        setMessage(null); // Clear previous messages
        setIsLoading(true);

        try {
            // Payload uses the label and includes the journal notes
            const payload = {
                mood: selectedMood.label, 
                notes: notes,
            };
            
            const response = await axios.post(`${API_BASE_URL}/api/moods/log`, payload); // Send to backend
            
            // Success path: Set success message and navigate
            setMessage({ type: 'success', text: "Mood logged successfully! Redirecting..." });
            
            // Use a short delay to show the success message before redirecting
            setTimeout(() => {
                navigate("/dashboard"); 
            }, 1000); 

        } catch (err) {
            // Failure path: Set error message
            console.error("Mood logging error:", err);
            setMessage({ 
                type: 'error', 
                text: "Failed to log mood. Check server connection and try again." 
            });
            setIsLoading(false); // Stop loading immediately on error

        } finally {
            // Your custom finally logic: Only stop loading if navigation didn't successfully start
            if (!message || message.type !== 'success') {
                setIsLoading(false); 
            }
        }
    };

    return (
        <div className="logmood-container">
            <div className="logmood-card">
                <header className="logmood-header">
                    <h1>How Are You Feeling Today?</h1>
                    <p>Select your current aura and add notes below.</p>
                </header>

                <form onSubmit={handleSubmit} className="mood-form">
                    
                    {/* 1. Dynamic Mood Selection Grid (Buttons) */}
                    <div className="mood-grid">
                        {moodOptions.map((mood) => (
                            <button
                                type="button" // Important: prevents form submission
                                key={mood.key}
                                className={`mood-option ${selectedMoodKey === mood.key ? 'selected' : ''}`}
                                style={{ '--mood-color': mood.color }}
                                onClick={() => setSelectedMoodKey(mood.key)}
                                aria-label={`Select mood: ${mood.label}`}
                            >
                                <mood.icon size={32} className="mood-icon" />
                                <span className="mood-label">{mood.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 2. Notes/Journal Entry */}
                    <div className="notes-section">
                        <label htmlFor="notes">Optional: What's on your mind?</label>
                        <textarea
                            id="notes"
                            rows="4"
                            placeholder="Write about your day, what caused this mood, or what you plan to do next."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    {/* 3. Feedback and Submit Button */}
                    <div className="feedback-section">
                        {message && (
                            <p className={`api-message ${message.type}`}>
                                {message.text}
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="submit-mood-btn" 
                        disabled={isLoading || !selectedMoodKey}
                    >
                        {isLoading 
                            ? (<><Loader size={20} className="spin" /> Saving Aura...</>)
                            : `Log ${selectedMood ? selectedMood.label : 'Select Mood'} & Continue`
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LogMood;