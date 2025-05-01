'use client';

import { useEffect, useState } from 'react';
import { fetchMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies(page);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadMovies(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
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
            热门电影
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Typography>加载中...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
              {movies.map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  priority={index < 4}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="contained"
                sx={{ minWidth: 100 }}
              >
                上一页
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={currentPage === pageNum ? 'contained' : 'outlined'}
                      sx={{ minWidth: 40 }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </Box>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="contained"
                sx={{ minWidth: 100 }}
              >
                下一页
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
} 