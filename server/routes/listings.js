import { Router } from "express";
import { query, body } from "express-validator";
import {
  getListings,
  getListingById,
  createListing,
  deleteListing,
  getMyListings,
} from "../controllers/listingController.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = Router();

const queryRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("bedrooms").optional().isInt({ min: 0 }).toInt(),
  query("minBedrooms").optional().isInt({ min: 0 }).toInt(),
];

const createRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
  body("type").isIn(["room", "studio", "apartment", "house"]).withMessage("Invalid type"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number").toFloat(),
  body("location.city").trim().notEmpty().withMessage("City is required"),
  body("bedrooms").optional().isInt({ min: 0 }).toInt(),
  body("bathrooms").optional().isInt({ min: 1 }).toInt(),
  body("size").optional().isFloat({ min: 0 }).toFloat(),
  body("furnished").optional().isBoolean().toBoolean(),
  body("amenities").optional().isArray(),
  body("images").optional().isArray(),
];

router.get("/", queryRules, getListings);
router.get("/mine", verifyToken, requireRole("landlord"), getMyListings);
router.post("/", verifyToken, requireRole("landlord"), createRules, createListing);
router.get("/:id", getListingById);
router.delete("/:id", verifyToken, requireRole("landlord"), deleteListing);

export default router;
