import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Pagination({ pagination }) {
  const [sp, setSp] = useSearchParams();
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  function goTo(p) {
    const next = new URLSearchParams(sp);
    next.set("page", p);
    setSp(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getRange() {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) range.push(i);
    if (range[0] > 1) { if (range[0] > 2) range.unshift("..."); range.unshift(1); }
    if (range[range.length - 1] < pages) { if (range[range.length - 1] < pages - 1) range.push("..."); range.push(pages); }
    return range;
  }

  const btnStyle = (active, disabled) => ({
    padding: "7px 12px",
    border: "1px solid",
    borderColor: active ? "var(--brand-600)" : "var(--gray-300)",
    background: active ? "var(--brand-600)" : "#fff",
    color: active ? "#fff" : disabled ? "var(--gray-400)" : "var(--gray-700)",
    borderRadius: "var(--radius)",
    fontSize: 14,
    cursor: disabled ? "default" : "pointer",
    fontWeight: 500,
    fontFamily: "inherit",
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 40 }}>
      <button style={btnStyle(false, page === 1)} disabled={page === 1} onClick={() => goTo(page - 1)}>
        ← Prev
      </button>
      {getRange().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} style={{ padding: "7px 6px", color: "var(--gray-400)" }}>…</span>
        ) : (
          <button key={p} style={btnStyle(p === page, false)} onClick={() => goTo(p)}>{p}</button>
        )
      )}
      <button style={btnStyle(false, page === pages)} disabled={page === pages} onClick={() => goTo(page + 1)}>
        Next →
      </button>
    </div>
  );
}
