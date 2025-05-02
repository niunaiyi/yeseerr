"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import { Movie } from "@/types/move";
import { LocalMovies } from "@mui/icons-material";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  inRadarr?: boolean;
}

export default function MovieCard({ movie, priority = false, inRadarr = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/movie/${movie.id}`} passHref>
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
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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

        {inRadarr && (
          <Tooltip title="已在电影库中" placement="top">
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalMovies sx={{ color: "primary.main", fontSize: "1.2rem" }} />
            </Box>
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
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
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
    </Link>
  );
} 