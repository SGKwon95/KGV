"use client";

import { useState, useEffect, useCallback } from "react";
import type { MovieWithReviews } from "@/types";

interface UseMoviesOptions {
  type?: "nowShowing" | "comingSoon" | "all";
  genre?: string;
  page?: number;
  limit?: number;
}

export function useMovies(options: UseMoviesOptions = {}) {
  const { type = "nowShowing", genre, page = 1, limit = 12 } = options;
  const [movies, setMovies] = useState<MovieWithReviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type,
        page: String(page),
        limit: String(limit),
        ...(genre && { genre }),
      });

      const res = await fetch(`/api/movies?${params}`);
      if (!res.ok) throw new Error("영화 목록을 불러오지 못했습니다.");

      const data = await res.json();
      setMovies(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [type, genre, page, limit]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, total, refetch: fetchMovies };
}
