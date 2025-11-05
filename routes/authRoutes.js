import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Registration Successful", userType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
);

/* ----------------------------
   USER LOGIN
---------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const userData = user.toObject();
    delete userData.password;

    // 5️ Send response (frontend expects token + user)
    res.status(200).json({
      message: "Login Successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* ----------------------------
   USER PROFILE (Protected)
---------------------------- */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


export default router;
