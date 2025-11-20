import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, required: true }, // e.g., Calm, Happy, Sad
  intensity: { type: Number, default: 5 }, // 1-10 scale
  timestamp: { type: Date, default: Date.now },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0], // YYYY-MM-DD
  },
});

const Mood = mongoose.model("Mood", MoodSchema);
export default Mood;
