import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import Image from 'next/image';
import { CalendarToday, Storage } from '@mui/icons-material';
import { RadarrMovie } from '@/types/radarr';

interface RadarrCardProps {
  movie: RadarrMovie;
  priority?: boolean;
}

export default function RadarrCard({ movie, priority = false }: RadarrCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '未知';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getPosterUrl = () => {
    const poster = movie.images.find(img => img.coverType === 'poster');
    if (!poster?.url) return '/placeholder.jpg';
    
    if (poster.url.startsWith('http')) {
      return poster.url;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_RADARR_URL || '';
    return `${baseUrl}${poster.url}`;
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
          {movie.releaseDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">
                发行日期: {formatDate(movie.releaseDate)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
} 