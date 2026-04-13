import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sendAuthResponse(res, statusCode, user) {
  const token = signToken(user._id);
  return res.status(statusCode).json({ token, user });
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password, role });
    return sendAuthResponse(res, 201, user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return sendAuthResponse(res, 200, user);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMe(req, res) {
  return res.json({ user: req.user });
}
