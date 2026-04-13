import { validationResult } from "express-validator";
import prisma from "../lib/prisma.js";

const senderSelect = { id: true, name: true, email: true, avatar: true };
const listingSelect = { id: true, title: true, city: true, images: true };

export async function sendMessage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { listingId, body } = req.body;
  try {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.ownerId === req.user.id) return res.status(400).json({ message: "You cannot message yourself" });

    const message = await prisma.message.create({
      data: { listingId, senderId: req.user.id, recipientId: listing.ownerId, body },
      include: {
        sender: { select: senderSelect },
        listing: { select: listingSelect },
      },
    });
    return res.status(201).json({ message });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getInbox(req, res) {
  try {
    const messages = await prisma.message.findMany({
      where: { recipientId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { sender: { select: senderSelect }, listing: { select: listingSelect } },
    });
    return res.json({ messages });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getSent(req, res) {
  try {
    const messages = await prisma.message.findMany({
      where: { senderId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { recipient: { select: senderSelect }, listing: { select: listingSelect } },
    });
    return res.json({ messages });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function markRead(req, res) {
  try {
    const msg = await prisma.message.findUnique({ where: { id: req.params.id } });
    if (!msg) return res.status(404).json({ message: "Message not found" });
    if (msg.recipientId !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    const updated = await prisma.message.update({ where: { id: req.params.id }, data: { read: true } });
    return res.json({ message: updated });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getUnreadCount(req, res) {
  try {
    const count = await prisma.message.count({ where: { recipientId: req.user.id, read: false } });
    return res.json({ count });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}
