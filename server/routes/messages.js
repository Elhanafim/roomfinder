import { Router } from "express";
import { body } from "express-validator";
import {
  sendMessage,
  getInbox,
  getSent,
  markRead,
  getUnreadCount,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

const sendRules = [
  body("listingId").notEmpty().withMessage("Listing ID is required"),
  body("body").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be 10–2000 characters"),
];

router.use(verifyToken);

router.post("/", sendRules, sendMessage);
router.get("/inbox", getInbox);
router.get("/sent", getSent);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markRead);

export default router;
