import mongoose from "mongoose";

const AMENITIES = [
  "WiFi", "Parking", "Laundry", "AC", "Heating", "Gym",
  "Pool", "Elevator", "Balcony", "Pet-Friendly", "Dishwasher", "Storage",
];

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["room", "studio", "apartment", "house"], required: true },
    price: { type: Number, required: true, min: 0 },
    location: {
      city: { type: String, required: true },
      neighborhood: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 1, min: 1 },
    size: { type: Number, default: null },
    furnished: { type: Boolean, default: false },
    amenities: [{ type: String, enum: AMENITIES }],
    images: [{ type: String }],
    available: { type: Boolean, default: true },
    availableFrom: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

listingSchema.index({ "location.city": 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ bedrooms: 1 });
listingSchema.index({ type: 1 });
listingSchema.index({ available: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ available: 1, "location.city": 1, price: 1 });

export { AMENITIES };
export default mongoose.model("Listing", listingSchema);
