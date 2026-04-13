import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) { setUnread(0); return; }
    api.get("/messages/unread-count")
      .then(({ data }) => setUnread(data.count))
      .catch(() => {});
  }, [isAuthenticated]);

  function handleLogout() {
    logout();
    navigate("/listings");
  }

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid var(--gray-200)", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link to="/listings" style={{ fontWeight: 700, fontSize: 20, color: "var(--brand-600)" }}>
          RoomFinder
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NavLink
            to="/listings"
            style={({ isActive }) => ({
              padding: "6px 14px",
              borderRadius: "var(--radius)",
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? "var(--brand-600)" : "var(--gray-600)",
              background: isActive ? "var(--brand-50)" : "transparent",
            })}
          >
            Browse
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/messages"
                style={({ isActive }) => ({
                  position: "relative",
                  padding: "6px 14px",
                  borderRadius: "var(--radius)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "var(--brand-600)" : "var(--gray-600)",
                  background: isActive ? "var(--brand-50)" : "transparent",
                })}
              >
                Messages
                {unread > 0 && (
                  <span style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "var(--brand-600)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 99,
                    padding: "1px 5px",
                  }}>
                    {unread}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/dashboard"
                style={({ isActive }) => ({
                  padding: "6px 14px",
                  borderRadius: "var(--radius)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "var(--brand-600)" : "var(--gray-600)",
                  background: isActive ? "var(--brand-50)" : "transparent",
                })}
              >
                Dashboard
              </NavLink>

              {user?.role === "landlord" && (
                <Link to="/listings/create" className="btn btn-primary btn-sm">
                  + List Room
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
