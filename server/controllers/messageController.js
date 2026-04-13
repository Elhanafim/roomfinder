import { validationResult } from "express-validator";
import Message from "../models/Message.js";
import Listing from "../models/Listing.js";

export async function sendMessage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { listingId, body } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }
    const message = await Message.create({
      listing: listingId,
      sender: req.user._id,
      recipient: listing.owner,
      body,
    });
    await message.populate([
      { path: "sender", select: "name email avatar" },
      { path: "listing", select: "title location" },
    ]);
    return res.status(201).json({ message });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid listing ID" });
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getInbox(req, res) {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "name email avatar")
      .populate("listing", "title location images")
      .lean();
    return res.json({ messages });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getSent(req, res) {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .populate("recipient", "name email avatar")
      .populate("listing", "title location images")
      .lean();
    return res.json({ messages });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function markRead(req, res) {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    if (msg.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    msg.read = true;
    await msg.save();
    return res.json({ message: msg });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getUnreadCount(req, res) {
  try {
    const count = await Message.countDocuments({ recipient: req.user._id, read: false });
    return res.json({ count });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}
