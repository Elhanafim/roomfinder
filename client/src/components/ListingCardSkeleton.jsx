import React from "react";

export default function ListingCardSkeleton() {
  return (
    <div className="card animate-pulse" style={{ overflow: "hidden" }}>
      <div style={{ height: 200, background: "var(--gray-200)" }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 20, background: "var(--gray-200)", borderRadius: 4, width: "40%", marginBottom: 10 }} />
        <div style={{ height: 16, background: "var(--gray-200)", borderRadius: 4, width: "90%", marginBottom: 8 }} />
        <div style={{ height: 14, background: "var(--gray-200)", borderRadius: 4, width: "60%", marginBottom: 16 }} />
        <div style={{ height: 12, background: "var(--gray-200)", borderRadius: 4, width: "80%", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 22, width: 55, background: "var(--gray-200)", borderRadius: 99 }} />
          ))}
        </div>
        <div style={{ height: 24, background: "var(--gray-200)", borderRadius: 4, width: "35%" }} />
      </div>
    </div>
  );
}
