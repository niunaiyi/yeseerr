"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { Movie } from "@/types/move";
import { getRadarrMovieTmdbIds } from "@/lib/radarr";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radarrMovieIds, setRadarrMovieIds] = useState<number[]>([]);
  const initialLoadRef = useRef(false);

  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies(page);

      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const ids =
        radarrMovieIds.length > 0
          ? radarrMovieIds
          : await getRadarrMovieTmdbIds();
      const moviesWithRadarrStatus = data.results.map((movie) => ({
        ...movie,
        inRadarr: ids.includes(movie.id),
      }));

      setMovies((prev) => [...prev, ...moviesWithRadarrStatus]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, radarrMovieIds]);

  useEffect(() => {
    const initLoad = async () => {
      if (!initialLoadRef.current) {
        initialLoadRef.current = true;
        try {
          const ids = await getRadarrMovieTmdbIds();
          setRadarrMovieIds(ids);
          await loadMoreMovies();
        } catch (err) {
          console.error("初始化加载失败:", err);
        }
      }
    };
    initLoad();
  }, [loadMoreMovies]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreMovies]);

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
          <IconButton
            component={Link}
            href="/"
            sx={{
              color: "primary.main",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            热门电影
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              priority={index < 4}
              inRadarr={movie.inRadarr}
            />
          ))}
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!hasMore && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography color="text.secondary">没有更多电影了</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
