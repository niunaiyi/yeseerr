"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchMovies, searchMovies } from "@/lib/movie";
import MediaCard from "@/components/MediaCard";
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";
import Link from "next/link";
import { getRadarrTmdbIds } from "@/lib/radarr";
import type { Media} from "@/types/Media";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radarrIds, setRadarrIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const initialLoadRef = useRef(false);

  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const data = searchQuery 
        ? await searchMovies(searchQuery, page)
        : await fetchMovies(page, activeTab === 'search' ? 'popular' : activeTab);

      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const ids =
        radarrIds.length > 0
          ? radarrIds
          : await getRadarrTmdbIds();

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
  }, [loading, hasMore, page, radarrIds, activeTab, searchQuery]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'popular' | 'top_rated' | 'now_playing' | 'search') => {
    setActiveTab(newValue);
    if (newValue !== 'search') {
      setSearchQuery('');
    }
    setMovies([]);
    setPage(1);
    setHasMore(true);
    initialLoadRef.current = false;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setMovies([]);
    setPage(1);
    setHasMore(true);
    initialLoadRef.current = false;
  };

  const handleAddSuccess = useCallback((movieId: number) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === movieId ? { ...movie, inRadarr: true } : movie
      )
    );
  }, []);

  useEffect(() => {
    const initLoad = async () => {
      if (!initialLoadRef.current) {
        initialLoadRef.current = true;
        try {
          const ids = await getRadarrTmdbIds();
          setRadarrIds(ids);
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
            电影
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="电影分类标签"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 'bold',
                minWidth: 'auto',
                px: 2,
              },
              '& .MuiTabs-scrollButtons': {
                color: 'primary.main',
              },
              '& .MuiTabs-scrollButtons.Mui-disabled': {
                opacity: 0.3,
              },
            }}
          >
            <Tab label="热门电影" value="popular" />
            <Tab label="正在上映" value="now_playing" />
            <Tab label="高分电影" value="top_rated" />
            <Tab label="AppleTV" value="2" />
            <Tab label="Netflix" value="8" />
            <Tab label="Hulu" value="15" />
            <Tab label="HBOMax" value="384" />
            <Tab label="AmazonVideo" value="12" />
            <Tab label="ShowMax" value="55" />
            <Tab label="ParamountPlus" value="531" />
            <Tab
              icon={
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="搜索电影..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                    },
                  }}
                />
              }
              sx={{ minWidth: 'auto', p: 0 }}
            />
          </Tabs>
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
            <MediaCard
              key={`${movie.id}-${index}`}
              movie={movie as Media}
              priority={index < 4}
              inRadarr={movie.inRadarr}
              onAddSuccess={() => handleAddSuccess(movie.id)}
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
