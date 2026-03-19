import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // -----------------------------
    // BASIC CHECK (empty fields)
    // -----------------------------
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // -----------------------------
    // ✅ ADD THIS VALIDATION HERE
    // -----------------------------
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // -----------------------------
    // CHECK IF USER EXISTS
    // -----------------------------
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already registered, please login"
      });
    }

    // -----------------------------
    // HASH PASSWORD
    // -----------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------
    // CREATE USER
    // -----------------------------
    const user = await User.create({
      email,
      password: hashedPassword
    });

    // -----------------------------
    // RESPONSE
    // -----------------------------
    res.json({
      token: generateToken(user._id),
      email: user.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found, please register"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    res.json({
      token: generateToken(user._id),
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};