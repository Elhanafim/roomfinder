import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import prisma from "../lib/prisma.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function sendAuthResponse(res, statusCode, user) {
  const token = signToken(user.id);
  return res.status(statusCode).json({ token, user: safeUser(user) });
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role?.toUpperCase() || "TENANT" },
    });
    return sendAuthResponse(res, 201, user);
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return sendAuthResponse(res, 200, user);
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function getMe(req, res) {
  const { password, ...user } = req.user;
  return res.json({ user });
}
