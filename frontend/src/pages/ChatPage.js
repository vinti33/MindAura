import { API_BASE_URL } from "../api";  // add at top
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/chat.css";


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setInput(""); // clear input

    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/ask`, {
        message: input,
      });

      const aiMsg = { role: "ai", content: res.data.reply };

      // Add both user and AI messages at once
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "ai", content: "Oops! AI is not responding 😅" },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">💖 Mind Aura AI Chat 💖</h2>

      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              msg.role === "user" ? "user-msg" : "ai-msg"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;
