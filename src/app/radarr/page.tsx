'use client';

import { useEffect, useState } from 'react';
import { fetchRadarrMovies } from '@/lib/radarr';
import RadarrCard from '@/components/RadarrCard';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { RadarrMovie } from '@/types/radarrmovie';
export default function RadarrPage() {
  const [movies, setMovies] = useState<RadarrMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    try {
      const data = await fetchRadarrMovies();
      setMovies(data);
    } catch (err) {
      setError('获取电影数据失败，请稍后重试');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography>加载中...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography>暂无电影数据</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <IconButton
            component={Link}
            href="/"
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            我的电影库
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          {movies.map((movie, index) => (
            <RadarrCard 
              key={movie.id} 
              movie={movie} 
              priority={index < 4}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
} 