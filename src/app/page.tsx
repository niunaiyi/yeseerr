'use client';

import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import Link from "next/link";
import { Movie, LocalMovies, LiveTv } from '@mui/icons-material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
          gap: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            maxWidth: 600,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            欢迎来到影视世界
          </Typography>
          
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ width: '100%', justifyContent: 'center' }}
          >
            <Button
              component={Link}
              href="/movies"
              variant="contained"
              size="large"
              startIcon={<Movie />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                },
              }}
            >
              浏览影片
            </Button>
            
            <Button
              component={Link}
              href="/tvshow"
              variant="contained"
              size="large"
              startIcon={<LiveTv />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)',
                },
              }}
            >
              浏览电视剧
            </Button>
            
            <Button
              component={Link}
              href="/radarr"
              variant="contained"
              size="large"
              startIcon={<LocalMovies />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                },
              }}
            >
              我的影视库
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
