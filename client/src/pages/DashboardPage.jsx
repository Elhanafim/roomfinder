import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ padding: 20, borderTop: `3px solid ${color || "var(--brand-600)"}` }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: color || "var(--brand-600)", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?.role !== "landlord") { setLoading(false); return; }
    api.get("/listings/mine")
      .then(({ data }) => setListings(data.listings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.delete(`/listings/${id}`);
      setListings((ls) => ls.filter((l) => l._id !== id));
    } catch {
      alert("Failed to delete listing.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            Welcome, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14, textTransform: "capitalize" }}>
            {user?.role} account
          </p>
        </div>
        {user?.role === "landlord" && (
          <Link to="/listings/create" className="btn btn-primary">+ New listing</Link>
        )}
      </div>

      {user?.role === "landlord" ? (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            <StatCard label="Total listings" value={listings.length} />
            <StatCard label="Active" value={listings.filter((l) => l.available).length} color="var(--green-600)" />
            <StatCard label="Total revenue / mo" value={`$${listings.reduce((s, l) => s + l.price, 0).toLocaleString()}`} color="#7c3aed" />
          </div>

          {/* Listings table */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--gray-100)", fontWeight: 600, fontSize: 16 }}>
              Your listings
            </div>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : listings.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "var(--gray-500)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
                <p style={{ marginBottom: 16 }}>You haven't listed any spaces yet.</p>
                <Link to="/listings/create" className="btn btn-primary">Create your first listing</Link>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--gray-50)", fontSize: 13, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                    <th style={{ padding: "10px 24px", textAlign: "left", fontWeight: 500 }}>Listing</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500 }}>City</th>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 500 }}>Price</th>
                    <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 500 }}>Status</th>
                    <th style={{ padding: "10px 24px", textAlign: "right", fontWeight: 500 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l._id} style={{ borderTop: "1px solid var(--gray-100)" }}>
                      <td style={{ padding: "14px 24px" }}>
                        <Link to={`/listings/${l._id}`} style={{ fontWeight: 500, color: "var(--gray-900)", fontSize: 14 }}>
                          {l.title}
                        </Link>
                        <div style={{ fontSize: 12, color: "var(--gray-400)", textTransform: "capitalize", marginTop: 2 }}>{l.type}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--gray-600)" }}>{l.location.city}</td>
                      <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, fontSize: 14 }}>${l.price.toLocaleString()}</td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span className={`badge ${l.available ? "badge-green" : "badge-gray"}`}>
                          {l.available ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <Link to={`/listings/${l._id}`} className="btn btn-secondary btn-sm">View</Link>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={deleting === l._id}
                            onClick={() => handleDelete(l._id)}
                          >
                            {deleting === l._id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        /* Tenant view */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          <Link to="/listings" className="card" style={{ padding: 28, textDecoration: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 32 }}>🔍</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Browse listings</div>
            <div style={{ fontSize: 14, color: "var(--gray-500)" }}>Find your next room</div>
          </Link>
          <Link to="/messages" className="card" style={{ padding: 28, textDecoration: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 32 }}>✉️</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Your messages</div>
            <div style={{ fontSize: 14, color: "var(--gray-500)" }}>Manage your inquiries</div>
          </Link>
        </div>
      )}
    </div>
  );
}
