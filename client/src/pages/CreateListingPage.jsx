import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";

const AMENITY_OPTIONS = [
  "WiFi", "Parking", "Laundry", "AC", "Heating", "Gym",
  "Pool", "Elevator", "Balcony", "Pet-Friendly", "Dishwasher", "Storage",
];

const TYPES = ["room", "studio", "apartment", "house"];

const initForm = {
  title: "",
  description: "",
  type: "apartment",
  price: "",
  "location.city": "",
  "location.neighborhood": "",
  "location.address": "",
  bedrooms: "1",
  bathrooms: "1",
  size: "",
  furnished: false,
  amenities: [],
  images: "",
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function toggleAmenity(a) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.description.trim().length < 20) e.description = "Description must be at least 20 characters";
    if (!form["location.city"].trim()) e["location.city"] = "City is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Valid price required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    setApiError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      price: Number(form.price),
      location: {
        city: form["location.city"].trim(),
        neighborhood: form["location.neighborhood"].trim(),
        address: form["location.address"].trim(),
      },
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      furnished: form.furnished,
      amenities: form.amenities,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    if (form.size) payload.size = Number(form.size);

    try {
      const { data } = await api.post("/listings", payload);
      navigate(`/listings/${data.listing._id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        const serverErrors = {};
        data.errors.forEach((e) => { serverErrors[e.path] = e.msg; });
        setErrors(serverErrors);
      } else {
        setApiError(data?.message || "Failed to create listing. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle = (key) => ({ ...(errors[key] ? { borderColor: "var(--red-600)" } : {}) });

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <Link to="/dashboard" style={{ fontSize: 14, color: "var(--brand-600)", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
        ← Back to dashboard
      </Link>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>List your space</h1>
        <p style={{ color: "var(--gray-500)", marginBottom: 32, fontSize: 15 }}>Fill in the details below to create your listing.</p>

        {apiError && <div className="alert alert-error" style={{ marginBottom: 24 }}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Basic info */}
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "var(--gray-700)" }}>Basic information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Listing title *</label>
                <input id="title" className="form-input" style={fieldStyle("title")} type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Bright Studio near Downtown" />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description * <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>(min. 20 chars)</span></label>
                <textarea id="description" className="form-input" style={{ ...fieldStyle("description"), resize: "vertical" }} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your space — layout, light, neighbourhood vibe…" />
                {errors.description && <span className="form-error">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Property type *</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("type", t)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: 99,
                        border: "1px solid",
                        borderColor: form.type === t ? "var(--brand-600)" : "var(--gray-300)",
                        background: form.type === t ? "var(--brand-600)" : "#fff",
                        color: form.type === t ? "#fff" : "var(--gray-700)",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "var(--gray-700)" }}>Location</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="city">City *</label>
                <input id="city" className="form-input" style={fieldStyle("location.city")} type="text" value={form["location.city"]} onChange={(e) => set("location.city", e.target.value)} placeholder="New York" />
                {errors["location.city"] && <span className="form-error">{errors["location.city"]}</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="neighborhood">Neighborhood</label>
                  <input id="neighborhood" className="form-input" type="text" value={form["location.neighborhood"]} onChange={(e) => set("location.neighborhood", e.target.value)} placeholder="Brooklyn Heights" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="address">Street address</label>
                  <input id="address" className="form-input" type="text" value={form["location.address"]} onChange={(e) => set("location.address", e.target.value)} placeholder="123 Main St" />
                </div>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "var(--gray-700)" }}>Details & pricing</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="price">Price / mo ($) *</label>
                  <input id="price" className="form-input" style={fieldStyle("price")} type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="1500" />
                  {errors.price && <span className="form-error">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bedrooms">Bedrooms</label>
                  <select id="bedrooms" className="form-input" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}>
                    <option value="0">Studio (0)</option>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bathrooms">Bathrooms</label>
                  <select id="bathrooms" className="form-input" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)}>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="size">Size (m²)</label>
                  <input id="size" className="form-input" type="number" min={0} value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="60" />
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                <input type="checkbox" checked={form.furnished} onChange={(e) => set("furnished", e.target.checked)} style={{ width: 18, height: 18 }} />
                Furnished
              </label>
            </div>
          </section>

          {/* Amenities */}
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "var(--gray-700)" }}>Amenities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {AMENITY_OPTIONS.map((a) => {
                const checked = form.amenities.includes(a);
                return (
                  <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: "var(--radius)", border: "1px solid", borderColor: checked ? "var(--brand-600)" : "var(--gray-200)", background: checked ? "var(--brand-50)" : "#fff", cursor: "pointer", fontSize: 14 }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleAmenity(a)} style={{ accentColor: "var(--brand-600)" }} />
                    {a}
                  </label>
                );
              })}
            </div>
          </section>

          {/* Images */}
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--gray-700)" }}>Images</h2>
            <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12 }}>Enter one image URL per line.</p>
            <textarea
              className="form-input"
              rows={3}
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              placeholder={"https://images.unsplash.com/photo-1522708323590?w=800\nhttps://..."}
              style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
            />
          </section>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160 }}>
              {loading ? "Publishing…" : "Publish listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
