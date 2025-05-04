"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { getSonarrTmdbIds } from "@/lib/sonarr";
import type { Media } from "@/types/Media";
import { fetchTVShows, searchTVShows} from "@/lib/tvshow";

export default function TVPage() {
  const [tvShows, setTVShows] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sonarrTmdbIds, setSonarrTmdbIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const initialLoadRef = useRef(false);

  const loadMoreTVShows = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const data = searchQuery 
        ? await searchTVShows(searchQuery, page)
        : await fetchTVShows(page, activeTab);

      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const ids = sonarrTmdbIds.length > 0 ? sonarrTmdbIds : await getSonarrTmdbIds();
      const tvShowsWithSonarrStatus = data.results.map((media) => ({
        ...media,
        inRadarr: ids.includes(media.id),
      }));

      setTVShows((prev) => [...prev, ...tvShowsWithSonarrStatus]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, sonarrTmdbIds, activeTab, searchQuery]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'popular' | 'top_rated' | 'on_the_air') => {
    setActiveTab(newValue);
    setTVShows([]);
    setPage(1);
    setHasMore(true);
    initialLoadRef.current = false;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setTVShows([]);
    setPage(1);
    setHasMore(true);
    initialLoadRef.current = false;
  };

  const handleAddSuccess = useCallback((TmdbId: number) => {
    setTVShows(prevShows => 
      prevShows.map(show => 
        show.id === TmdbId ? { ...show, inRadarr: true } : show
      )
    );
  }, []);

  useEffect(() => {
    const initLoad = async () => {
      if (!initialLoadRef.current) {
        initialLoadRef.current = true;
        try {
          const ids = await getSonarrTmdbIds();
          setSonarrTmdbIds(ids);
          await loadMoreTVShows();
        } catch (err) {
          console.error("初始化加载失败:", err);
        }
      }
    };
    
    initLoad();
  }, [loadMoreTVShows]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100
      ) {
        loadMoreTVShows();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreTVShows]);

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
            电视剧
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="电视剧分类标签"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                },
              }}
            >
              <Tab label="热门剧集" value="popular" />
              <Tab label="正在播出" value="on_the_air" />
              <Tab label="高分剧集" value="top_rated" />
              <Tab label="Netflix" value="213" />
              <Tab label="AppleTV+" value="2552" />
              <Tab label="HBO" value="49" />
              <Tab label="Hulu" value="453" />
              <Tab label="Disney+" value="2739" />
              <Tab label="PrimeVideo" value="1024" />
              <Tab label="Discovery+" value="4353" />
              <Tab label="CINEMAX" value="359" />
            </Tabs>

            <TextField
              size="small"
              variant="outlined"
              placeholder="搜索电视剧..."
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
          </Box>
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
          {tvShows.map((show, index) => (
            <MediaCard
              key={`${show.id}-${index}`}
              movie={show}
              priority={index < 4}
              inRadarr={show.inRadarr}
              onAddSuccess={() => handleAddSuccess(show.id)}
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
            <Typography color="text.secondary">没有更多电视剧了</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
} 