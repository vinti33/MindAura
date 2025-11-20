import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";


router.get("/test", (req, res) => {
  res.send("Auth route is working");
});

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Signup Successful",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.log("[SIGNUP ERROR]", error.message);
    console.log("[SIGNUP ERROR FULL]", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect Password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.log("[LOGIN ERROR]", error.message);
    console.log("[LOGIN ERROR FULL]", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});



export default router;
