import React, { useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function ContactForm({ listingId, ownerName }) {
  const { isAuthenticated, user } = useAuth();
  const [body, setBody] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "var(--gray-600)", fontSize: 14 }}>
        <Link to="/login" className="btn btn-primary btn-full" style={{ marginBottom: 8 }}>
          Sign in to contact {ownerName}
        </Link>
        <p>Don't have an account? <Link to="/register" style={{ color: "var(--brand-600)" }}>Sign up free</Link></p>
      </div>
    );
  }

  if (user?.role === "landlord") {
    return (
      <p style={{ fontSize: 14, color: "var(--gray-500)", padding: "12px 0", textAlign: "center" }}>
        Landlord accounts cannot send inquiries.
      </p>
    );
  }

  if (state === "success") {
    return (
      <div className="alert alert-success" style={{ textAlign: "center" }}>
        ✅ Message sent! {ownerName} will get back to you soon.
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (body.trim().length < 10) { setErrorMsg("Message must be at least 10 characters."); return; }
    setState("loading");
    setErrorMsg("");
    try {
      await api.post("/messages", { listingId, body: body.trim() });
      setState("success");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send. Try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label className="form-label" htmlFor="msg-body">
        Message to {ownerName}
      </label>
      <textarea
        id="msg-body"
        className="form-input"
        rows={4}
        placeholder={`Hi ${ownerName}, I'm interested in this listing…`}
        value={body}
        onChange={(e) => { setBody(e.target.value); setErrorMsg(""); setState("idle"); }}
        style={{ resize: "vertical" }}
      />
      {errorMsg && <p className="form-error">{errorMsg}</p>}
      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={state === "loading"}
      >
        {state === "loading" ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
