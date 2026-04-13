import { useState, useEffect } from "react";
import api from "../services/api.js";

export function useListings(searchParams) {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = Object.fromEntries(
      [...searchParams.entries()].filter(([, v]) => v !== "")
    );

    api
      .get("/listings", { params })
      .then(({ data }) => {
        if (!cancelled) {
          setListings(data.listings);
          setPagination(data.pagination);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load listings");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [searchParams.toString()]);

  return { listings, pagination, loading, error };
}
