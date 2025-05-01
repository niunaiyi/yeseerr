import { Card, CardContent, CardMedia, Typography, Box, Chip, Stack, Tooltip } from '@mui/material';
import Image from 'next/image';
import { Star, CalendarMonth, Visibility } from '@mui/icons-material';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const getPosterUrl = () => {
    if (!movie.poster_path) return '/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 400 }}>
        <Image
          src={getPosterUrl()}
          alt={movie.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            color: 'white',
          }}
        >
          <Typography variant="h6" component="div" noWrap sx={{ mb: 1 }}>
            {movie.title}
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth fontSize="small" />
              <Typography variant="body2">
                {new Date(movie.release_date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star fontSize="small" />
              <Typography variant="body2">
                {movie.vote_average.toFixed(1)} 分
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
} 