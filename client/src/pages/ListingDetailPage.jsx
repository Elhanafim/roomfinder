import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import ContactForm from "../components/ContactForm.jsx";

const AMENITY_ICONS = {
  WiFi: "📶", Parking: "🅿️", Laundry: "🧺", AC: "❄️", Heating: "🔥",
  Gym: "🏋️", Pool: "🏊", Elevator: "🛗", Balcony: "🌇", "Pet-Friendly": "🐾",
  Dishwasher: "🍽️", Storage: "📦",
};

const TYPE_LABELS = { room: "Room", studio: "Studio", apartment: "Apartment", house: "House" };

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 12px", background: "var(--gray-50)", borderRadius: "var(--radius)" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/listings/${id}`)
      .then(({ data }) => setListing(data.listing))
      .catch((err) => {
        if (err.response?.status === 404) setError("This listing doesn't exist or has been removed.");
        else if (err.response?.status === 400) setError("Invalid listing ID.");
        else setError("Failed to load listing. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 60 }}>
        <div className="page-loader"><div className="spinner" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2 style={{ marginBottom: 8, color: "var(--gray-800)" }}>{error}</h2>
        <Link to="/listings" className="btn btn-primary" style={{ marginTop: 16 }}>Browse all listings</Link>
      </div>
    );
  }

  const { title, type, price, location, bedrooms, bathrooms, size, furnished, description, amenities, images, owner, availableFrom } = listing;
  const bedroomsLabel = bedrooms === 0 ? "Studio" : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <Link to="/listings" style={{ fontSize: 14, color: "var(--brand-600)", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
        ← Back to listings
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "flex-start" }}>
        {/* Left column */}
        <div>
          {/* Image */}
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 28, height: 400, background: "var(--gray-100)" }}>
            {images?.[0] ? (
              <img src={images[0]} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 80 }}>🏠</div>
            )}
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <span className="badge badge-blue" style={{ textTransform: "capitalize" }}>{TYPE_LABELS[type] || type}</span>
            {furnished && <span className="badge badge-green">Furnished</span>}
          </div>

          {/* Title & location */}
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{title}</h1>
          <p style={{ color: "var(--gray-500)", marginBottom: 24, fontSize: 15 }}>
            📍 {[location.address, location.neighborhood, location.city].filter(Boolean).join(", ")}
          </p>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
            <Stat label="Bedrooms" value={bedroomsLabel} />
            <Stat label="Bathrooms" value={bathrooms} />
            {size && <Stat label="Size" value={`${size} m²`} />}
            <Stat label="Available from" value={new Date(availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
          </div>

          {/* Description */}
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>About this place</h2>
            <p style={{ color: "var(--gray-600)", lineHeight: 1.7 }}>{description}</p>
          </section>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Amenities</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                {amenities.map((a) => (
                  <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--gray-50)", borderRadius: "var(--radius)", fontSize: 14, color: "var(--gray-700)" }}>
                    <span>{AMENITY_ICONS[a] || "✓"}</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ position: "sticky", top: 80 }}>
          {/* Price card */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "var(--brand-600)" }}>${price.toLocaleString()}</span>
              <span style={{ color: "var(--gray-400)", fontSize: 15 }}> / month</span>
            </div>
            <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: 16 }}>
              <ContactForm listingId={listing._id} ownerName={owner?.name?.split(" ")[0] || "the host"} />
            </div>
          </div>

          {/* Owner card */}
          {owner && (
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-500)", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".05em" }}>
                Listed by
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--brand-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--brand-700)", flexShrink: 0 }}>
                  {owner.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{owner.name}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Landlord</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
