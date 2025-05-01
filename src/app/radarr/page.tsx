'use client';

import { useEffect, useState } from 'react';
import { fetchRadarrMovies } from '@/lib/radarr';
import RadarrCard from '@/components/RadarrCard';

interface RadarrMovie {
  id: number;
  title: string;
  originalTitle: string;
  year: number;
  path: string;
  qualityProfileId: number;
  monitored: boolean;
  minimumAvailability: string;
  isAvailable: boolean;
  overview: string;
  images: {
    coverType: string;
    url: string;
  }[];
  tmdbId: number;
  imdbId: string;
  youTubeTrailerId: string;
  status: string;
  hasFile: boolean;
  downloaded: boolean;
  sizeOnDisk: number;
  added: string;
  physicalRelease: string;
  digitalRelease: string;
}

export default function RadarrPage() {
  const [movies, setMovies] = useState<RadarrMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadMovies();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!movies || movies.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">暂无电影数据</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的电影库</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <RadarrCard 
            key={movie.id} 
            movie={movie} 
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
} 