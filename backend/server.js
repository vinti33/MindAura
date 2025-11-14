// import dotenv from "dotenv";
// dotenv.config(); // <CHANGE> Load env vars first, before anything else

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import moodRoutes from "./routes/moodRoutes.js";
// import authRoutes from "./routes/auth.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const app = express();

// // <CHANGE> Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// // <CHANGE> Test connection after initialization
// console.log("[v0] GEMINI_API_KEY loaded:", process.env.GEMINI_API_KEY ? "✓ Yes" : "✗ No");
// try {
//   const testResult = await model.generateContent("Hello");
//   console.log("[v0] Gemini API test successful");
// } catch (testError) {
//   console.log("[v0] Gemini API test failed:", testError.message);
// }

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/moods", moodRoutes);

// // ----------------------
// // AI Chatbot Endpoint with Tone & Behavior
// // ----------------------
// app.post("/api/chat", async (req, res) => {
//     const { message } = req.body;

//     if (!message) {
//         return res.status(400).json({ error: "Message is required" });
//     }

//     try {
//         const systemPrompt = `
// You are Mind Aura — a calm, empathetic, and insightful mental wellness companion.

// 💬 Tone:
// - Gentle, compassionate, and understanding
// - Encouraging self-reflection and mindfulness
// - Avoid harsh or judgmental language

// 🎯 Behavior:
// - Respond with emotional understanding and practical coping tips if user shares feelings
// - Redirect politely if the user asks unrelated questions
// - Keep responses concise, clear, and supportive

// 🪄 Example:
// User: "I feel anxious about exams."
// Response: "It's completely normal to feel anxious. Try a 5-minute deep breathing break. Would you like a short visualization exercise?"

// User: "I am bored."
// Response: "Boredom happens sometimes. Maybe try a short mindfulness exercise or jot down your thoughts in a journal."
//         `;

//         const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
        
//         const result = await model.generateContent(fullPrompt);
//         const aiReply = result.response.text();

//         res.json({ reply: aiReply });

//     } catch (err) {
//         console.error("Gemini API Error:", err.message);
//         res.status(500).json({ error: "Failed to get AI response" });
//     }
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log("MongoDB Error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// server.js
// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();

// Middleware
// Allow frontend to access backend (replace with your frontend URL in production)
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
