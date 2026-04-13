import React from "react";
import { useSearchParams } from "react-router-dom";
import SearchFilters from "../components/SearchFilters.jsx";
import ListingCard from "../components/ListingCard.jsx";
import ListingCardSkeleton from "../components/ListingCardSkeleton.jsx";
import Pagination from "../components/Pagination.jsx";
import { useListings } from "../hooks/useListings.js";

export default function ListingSearchPage() {
  const [searchParams] = useSearchParams();
  const { listings, pagination, loading, error } = useListings(searchParams);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "flex-start" }}>
        <SearchFilters />

        <main>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>
              {loading ? "Searching…" : `${pagination?.total ?? 0} listing${pagination?.total !== 1 ? "s" : ""} found`}
            </h1>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {Array.from({ length: 9 }, (_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          ) : !error && listings.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--gray-500)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
              <h3 style={{ fontWeight: 600, marginBottom: 8, color: "var(--gray-700)" }}>No listings found</h3>
              <p style={{ fontSize: 14 }}>Try adjusting your filters or searching in a different city.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
              </div>
              <Pagination pagination={pagination} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
