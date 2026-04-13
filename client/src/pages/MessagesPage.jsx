import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function MessageRow({ msg, isInbox, onMarkRead }) {
  const other = isInbox ? msg.sender : msg.recipient;
  const isUnread = isInbox && !msg.read;
  const date = new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr auto",
        gap: 12,
        padding: "16px 24px",
        borderTop: "1px solid var(--gray-100)",
        background: isUnread ? "var(--brand-50)" : "#fff",
        alignItems: "center",
      }}
    >
      {/* Avatar */}
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "var(--gray-600)", flexShrink: 0 }}>
        {other?.name?.[0]?.toUpperCase() || "?"}
      </div>

      {/* Content */}
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: isUnread ? 700 : 500, fontSize: 14 }}>{other?.name}</span>
          {isUnread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-600)", flexShrink: 0 }} />}
        </div>
        {msg.listing && (
          <div style={{ fontSize: 12, color: "var(--brand-600)", marginBottom: 4 }}>
            Re: <Link to={`/listings/${msg.listing._id}`} style={{ color: "inherit" }}>{msg.listing.title}</Link>
          </div>
        )}
        <p style={{ fontSize: 14, color: "var(--gray-600)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {msg.body}
        </p>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{date}</span>
        {isInbox && !msg.read && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 12, padding: "3px 10px" }}
            onClick={() => onMarkRead(msg._id)}
          >
            Mark read
          </button>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("/messages/inbox"), api.get("/messages/sent")])
      .then(([inboxRes, sentRes]) => {
        setInbox(inboxRes.data.messages);
        setSent(sentRes.data.messages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id) {
    try {
      await api.patch(`/messages/${id}/read`);
      setInbox((msgs) => msgs.map((m) => m._id === id ? { ...m, read: true } : m));
    } catch {}
  }

  const unreadCount = inbox.filter((m) => !m.read).length;
  const current = tab === "inbox" ? inbox : sent;
  const isInbox = tab === "inbox";

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Messages</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid var(--gray-200)", marginBottom: 24 }}>
        {[
          { key: "inbox", label: `Inbox${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          { key: "sent", label: "Sent" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: `2px solid ${tab === t.key ? "var(--brand-600)" : "transparent"}`,
              background: "none",
              color: tab === t.key ? "var(--brand-600)" : "var(--gray-500)",
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: 15,
              cursor: "pointer",
              marginBottom: -2,
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : current.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--gray-500)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
            <p style={{ marginBottom: 16 }}>
              {isInbox ? "Your inbox is empty." : "You haven't sent any messages yet."}
            </p>
            {!isInbox && <Link to="/listings" className="btn btn-primary">Browse listings</Link>}
          </div>
        ) : (
          current.map((msg) => (
            <MessageRow key={msg._id} msg={msg} isInbox={isInbox} onMarkRead={markRead} />
          ))
        )}
      </div>
    </div>
  );
}
