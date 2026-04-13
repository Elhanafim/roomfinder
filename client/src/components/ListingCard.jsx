import React from "react";
import { Link } from "react-router-dom";

const TYPE_COLORS = {
  room: { bg: "#dbeafe", color: "#1d4ed8" },
  studio: { bg: "#ede9fe", color: "#6d28d9" },
  apartment: { bg: "#d1fae5", color: "#065f46" },
  house: { bg: "#fef3c7", color: "#92400e" },
};

function BedroomsLabel({ n }) {
  if (n === 0) return "Studio";
  return `${n} bed${n > 1 ? "s" : ""}`;
}

export default function ListingCard({ listing }) {
  const { _id, title, type, price, location, bedrooms, bathrooms, furnished, amenities, images } = listing;
  const typeStyle = TYPE_COLORS[type] || TYPE_COLORS.apartment;
  const displayAmenities = amenities?.slice(0, 3) ?? [];
  const extra = (amenities?.length ?? 0) - 3;

  return (
    <Link to={`/listings/${_id}`} style={{ display: "block", textDecoration: "none" }}>
      <article
        className="card"
        style={{ overflow: "hidden", transition: "box-shadow .2s, transform .2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      >
        <div style={{ height: 200, overflow: "hidden", background: "var(--gray-100)" }}>
          {images?.[0] ? (
            <img
              src={images[0]}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--gray-400)", fontSize: 40 }}>🏠</div>
          )}
        </div>

        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <span className="badge" style={{ background: typeStyle.bg, color: typeStyle.color, textTransform: "capitalize" }}>
              {type}
            </span>
            {furnished && <span className="badge badge-green">Furnished</span>}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4, lineHeight: 1.3 }}>
            {title}
          </h3>

          <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12 }}>
            📍 {location.neighborhood ? `${location.neighborhood}, ` : ""}{location.city}
          </p>

          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--gray-600)", marginBottom: 12 }}>
            <span>🛏 <BedroomsLabel n={bedrooms} /></span>
            <span>🚿 {bathrooms} bath{bathrooms > 1 ? "s" : ""}</span>
          </div>

          {displayAmenities.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {displayAmenities.map((a) => (
                <span key={a} className="badge badge-gray">{a}</span>
              ))}
              {extra > 0 && <span className="badge badge-gray">+{extra}</span>}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--gray-100)", paddingTop: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-600)" }}>
              ${price.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: "var(--gray-400)" }}>/ month</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
