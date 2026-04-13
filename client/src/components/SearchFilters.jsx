import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const TYPES = ["room", "studio", "apartment", "house"];
const BEDROOM_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Studio", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4+", value: "4+", param: "minBedrooms", paramValue: "4" },
];

function countActiveFilters(sp) {
  const keys = ["city", "type", "minPrice", "maxPrice", "bedrooms", "minBedrooms", "furnished"];
  return keys.filter((k) => sp.get(k)).length;
}

export default function SearchFilters() {
  const [sp, setSp] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = countActiveFilters(sp);

  function set(key, value) {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    setSp(next);
  }

  function handleBedrooms(opt) {
    const next = new URLSearchParams(sp);
    next.delete("bedrooms");
    next.delete("minBedrooms");
    next.delete("page");
    if (opt.param) next.set(opt.param, opt.paramValue);
    else if (opt.value) next.set("bedrooms", opt.value);
    setSp(next);
  }

  function clearAll() {
    setSp({});
  }

  const currentBedrooms = sp.get("bedrooms") || (sp.get("minBedrooms") ? "4+" : "");

  const filtersContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontWeight: 600, fontSize: 16 }}>Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} style={{ fontSize: 13, color: "var(--brand-600)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">City</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. New York"
          value={sp.get("city") || ""}
          onChange={(e) => set("city", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Type</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TYPES.map((t) => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input
                type="radio"
                name="type"
                value={t}
                checked={sp.get("type") === t}
                onChange={() => set("type", t)}
              />
              <span style={{ textTransform: "capitalize" }}>{t}</span>
            </label>
          ))}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
            <input type="radio" name="type" value="" checked={!sp.get("type")} onChange={() => set("type", "")} />
            <span>Any type</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Bedrooms</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BEDROOM_OPTIONS.map((opt) => {
            const active = currentBedrooms === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleBedrooms(opt)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  border: "1px solid",
                  borderColor: active ? "var(--brand-600)" : "var(--gray-300)",
                  background: active ? "var(--brand-600)" : "#fff",
                  color: active ? "#fff" : "var(--gray-700)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Price range ($/mo)</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="form-input"
            type="number"
            placeholder="Min"
            min={0}
            value={sp.get("minPrice") || ""}
            onChange={(e) => set("minPrice", e.target.value)}
            style={{ flex: 1 }}
          />
          <span style={{ color: "var(--gray-400)", fontSize: 14 }}>–</span>
          <input
            className="form-input"
            type="number"
            placeholder="Max"
            min={0}
            value={sp.get("maxPrice") || ""}
            onChange={(e) => set("maxPrice", e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
        <input
          type="checkbox"
          checked={sp.get("furnished") === "true"}
          onChange={(e) => set("furnished", e.target.checked ? "true" : "")}
        />
        <span>Furnished only</span>
      </label>

      <div className="form-group">
        <label className="form-label">Sort by</label>
        <select
          className="form-input"
          value={sp.get("sort") || "newest"}
          onChange={(e) => set("sort", e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div style={{ display: "none" }} className="mobile-filter-toggle">
        <button
          className="btn btn-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ gap: 8 }}
        >
          Filters {activeCount > 0 && <span className="badge badge-blue">{activeCount}</span>}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="card"
        style={{ padding: 24, position: "sticky", top: 80, alignSelf: "flex-start" }}
      >
        {filtersContent}
      </aside>
    </>
  );
}
