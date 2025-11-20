import express from "express";
import { getUserMoodTrends, logMood, getTodayMoodStats } from "../controllers/moodController.js";
import  authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all mood routes
router.post("/log", authMiddleware, logMood);
router.get("/trends", authMiddleware, getUserMoodTrends,getTodayMoodStats);
//router.get("/today", authMiddleware, getTodayMoodStats,getUserMoodTrends);


export default router;

