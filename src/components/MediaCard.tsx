"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, Typography, Chip, Tooltip, Button, Snackbar, Alert } from "@mui/material";
import { Media } from "@/types/Media";
import { LocalMovies, Add } from "@mui/icons-material";
import { addMovieToRadarr, getDefaultAddMovieParams} from "@/lib/radarr";

interface MovieCardProps {
  movie: Media;
  priority?: boolean;
  inRadarr?: boolean;
  onAddSuccess?: () => void;
}

export default function MediaCard({
  movie,
  priority = false,
  onAddSuccess,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddToRadarr = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      console.log('movie', movie);

        const movieParams = getDefaultAddMovieParams(movie.id, movie.title);        
        await addMovieToRadarr(movieParams);
      setSnackbar({
        open: true,
        message: '本地库添加成功',
        severity: 'success',
      });
      onAddSuccess?.();
    } catch (error) {
      console.error("添加电影失败:", error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '添加电影失败',
        severity: 'error',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "2/3",
          borderRadius: 2,
          overflow: "hidden",
          cursor: "pointer",
          "&:hover .movie-info": {
            opacity: 1,
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={`${movie.poster_path}`}
          alt={movie.title}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          priority={priority}
          style={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {movie.inRadarr ? (
          <Tooltip title="已在本地库中" placement="top">
            <Button
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                minWidth: "36px",
                width: "36px",
                height: "36px",
                padding: 0,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <LocalMovies sx={{ color: "primary.main", fontSize: "1.2rem" }} />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="添加到本地库" placement="top">
            <Button
              onClick={handleAddToRadarr}
              disabled={isAdding}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                minWidth: "36px",
                width: "36px",
                height: "36px",
                padding: 0,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <Add sx={{ color: "primary.main", fontSize: "1.2rem" }} />
            </Button>
          </Tooltip>
        )}

        <Box
          className="movie-info"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
            color: "white",
            opacity: 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {movie.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${movie.vote_average.toFixed(1)}`}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {movie.release_date.split("-")[0]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
