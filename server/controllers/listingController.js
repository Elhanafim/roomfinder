import { validationResult } from "express-validator";
import prisma from "../lib/prisma.js";

const SORT_MAP = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
};

function buildWhere(params) {
  const { city, type, furnished, minPrice, maxPrice, bedrooms, minBedrooms } = params;
  const where = { available: true };

  if (city) where.city = { contains: city, mode: "insensitive" };
  if (type) where.type = type.toUpperCase();
  if (furnished !== undefined) where.furnished = furnished === "true";
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (bedrooms !== undefined && bedrooms !== "") {
    where.bedrooms = parseInt(bedrooms);
  } else if (minBedrooms) {
    where.bedrooms = { gte: parseInt(minBedrooms) };
  }

  return where;
}

const ownerSelect = { id: true, name: true, email: true, avatar: true };

export async function getListings(req, res) {
  try {
    const { page = 1, limit = 9, sort = "newest" } = req.query;
    const where = buildWhere(req.query);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = SORT_MAP[sort] || SORT_MAP.newest;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({ where, orderBy, skip, take: parseInt(limit), include: { owner: { select: ownerSelect } } }),
      prisma.listing.count({ where }),
    ]);

    return res.json({
      listings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getListingById(req, res) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: { owner: { select: ownerSelect } },
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    return res.json({ listing });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createListing(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { title, description, type, price, location, bedrooms, bathrooms, size, furnished, amenities, images } = req.body;
  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        type: type.toUpperCase(),
        price: parseFloat(price),
        city: location?.city || req.body.city,
        neighborhood: location?.neighborhood || req.body.neighborhood || "",
        address: location?.address || req.body.address || "",
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 1,
        size: size ? parseFloat(size) : null,
        furnished: Boolean(furnished),
        amenities: amenities || [],
        images: images || [],
        ownerId: req.user.id,
      },
      include: { owner: { select: ownerSelect } },
    });
    return res.status(201).json({ listing });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteListing(req, res) {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.ownerId !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    await prisma.listing.delete({ where: { id: req.params.id } });
    return res.json({ message: "Listing deleted" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMyListings(req, res) {
  try {
    const listings = await prisma.listing.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ listings });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}
