import Mood from "../models/Mood.js";

// Log a mood
export const logMood = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const newMood = new Mood({
      user: req.user.id,
      mood,
      date: new Date(),
    });

    await newMood.save();
    res.status(201).json({ message: "Mood logged successfully", newMood });
  } catch (error) {
    console.error("Error logging mood:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch mood trends
export const getUserMoodTrends = async (req, res) => {
  try {
    const rawMoods = await Mood.find({ user: req.user.id }).sort({ date: -1 });

    if (!rawMoods.length) {
      return res.status(200).json({
        totalEntries: 0,
        longestStreak: 0,
        mostCommonMood: "None",
        mostCommonMoodToday: "None",
        moods: [],
      });
    }

    // Filter daily moods → Keep last mood of each day
    const filteredDailyMoods = [];
    let seenDates = new Set();
    rawMoods.forEach((m) => {
      const day = m.date.toString().split("T")[0];
      if (!seenDates.has(day)) {
        filteredDailyMoods.push(m);
        seenDates.add(day);
      }
    });

    // Total entries (unique days logged)
    const totalEntries = filteredDailyMoods.length;

    // Streak calculation
    let longestStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < filteredDailyMoods.length; i++) {
      const prev = new Date(filteredDailyMoods[i - 1].date);
      const curr = new Date(filteredDailyMoods[i].date);

      const diffDays =
        (prev.setHours(0, 0, 0, 0) - curr.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    // Most common mood overall
    const countMood = {};
    rawMoods.forEach((m) => {
      countMood[m.mood] = (countMood[m.mood] || 0) + 1;
    });
    const mostCommonMood = Object.keys(countMood).reduce((a, b) =>
      countMood[a] > countMood[b] ? a : b
    );

    // Most common mood today
    const today = new Date().toISOString().split("T")[0];
    const todaysMoods = rawMoods.filter(
      (m) => m.date.toString().split("T")[0] === today
    );

    let mostCommonMoodToday = "None";
    if (todaysMoods.length) {
      const countToday = {};
      todaysMoods.forEach(
        (m) => (countToday[m.mood] = (countToday[m.mood] || 0) + 1)
      );
      mostCommonMoodToday = Object.keys(countToday).reduce((a, b) =>
        countToday[a] > countToday[b] ? a : b
      );
    }

    return res.status(200).json({
      totalEntries: rawMoods.length,
      longestStreak,
      mostCommonMood,
      mostCommonMoodToday,
      moods: rawMoods,
    });
  } catch (error) {
    console.error("Error fetching mood trends:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch today's most recent mood
export const getTodayMoodStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });

    const todaysMoods = moods.filter(
      (m) => m.date.toISOString().split("T")[0] === today
    );

    if (!todaysMoods.length) {
      return res.status(200).json({ message: "No mood logged today", mood: null });
    }

    const latestMood = todaysMoods[0]; // Most recent today
    return res.status(200).json({ mood: latestMood });
  } catch (error) {
    console.error("Error fetching today's mood:", error);
    res.status(500).json({ message: "Server error" });
  }
};
