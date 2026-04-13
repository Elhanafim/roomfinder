import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import messageRoutes from "./routes/messages.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Cache connection across serverless warm invocations
let dbConnected = false;

export default async function handler(req, res) {
  if (!dbConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    dbConnected = true;
  }
  app(req, res);
}

// Local dev
if (process.env.NODE_ENV !== "production") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
}
