import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ROLES = [
  { value: "tenant", icon: "🔍", label: "Tenant", desc: "I'm looking for a place" },
  { value: "landlord", icon: "🏠", label: "Landlord", desc: "I have a place to list" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/listings");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) setError(data.errors[0].msg);
      else setError(data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 440, padding: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Create account</h1>
        <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 28 }}>Find or list your next room</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div style={{ display: "flex", gap: 10 }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "var(--radius)",
                    border: "2px solid",
                    borderColor: form.role === r.value ? "var(--brand-600)" : "var(--gray-200)",
                    background: form.role === r.value ? "var(--brand-50)" : "#fff",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input id="name" type="text" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" required minLength={6} autoComplete="new-password" />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "var(--gray-500)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--brand-600)", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
