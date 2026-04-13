import { validationResult } from "express-validator";
import Listing from "../models/Listing.js";

function buildQuery(params) {
  const { city, type, furnished, minPrice, maxPrice, bedrooms, minBedrooms } = params;
  const query = { available: true };

  if (city) query["location.city"] = { $regex: city, $options: "i" };
  if (type) query.type = type;
  if (furnished !== undefined) query.furnished = furnished === "true";
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (bedrooms !== undefined && bedrooms !== "") {
    query.bedrooms = parseInt(bedrooms);
  } else if (minBedrooms) {
    query.bedrooms = { $gte: parseInt(minBedrooms) };
  }

  return query;
}

export async function getListings(req, res) {
  try {
    const { page = 1, limit = 9, sort = "newest" } = req.query;
    const query = buildQuery(req.query);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const [listings, total] = await Promise.all([
      Listing.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).populate("owner", "name email avatar").lean(),
      Listing.countDocuments(query),
    ]);

    return res.json({
      listings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getListingById(req, res) {
  try {
    const listing = await Listing.findById(req.params.id).populate("owner", "name email avatar");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    return res.json({ listing });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid listing ID" });
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createListing(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const listing = await Listing.create({ ...req.body, owner: req.user._id });
    await listing.populate("owner", "name email avatar");
    return res.status(201).json({ listing });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteListing(req, res) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await listing.deleteOne();
    return res.json({ message: "Listing deleted" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid listing ID" });
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMyListings(req, res) {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ listings });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}
