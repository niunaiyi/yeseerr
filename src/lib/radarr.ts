import { RadarrMovie } from '@/types/radarrmovie';

interface RadarrConfig {
  baseUrl: string;
  apiKey: string;
}

const config: RadarrConfig = {
  baseUrl: process.env.NEXT_PUBLIC_RADARR_URL || '',
  apiKey: process.env.NEXT_PUBLIC_RADARR_API_KEY || '',
};

export async function fetchRadarrMovies(): Promise<RadarrMovie[]> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Radarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/movie?language=10`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Radarr API 请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取 Radarr 电影列表失败:', error);
    throw error;
  }
}

// 将 Radarr 电影数据转换为通用电影格式
export function convertToMovieFormat(radarrMovie: RadarrMovie) {
  return {
    id: radarrMovie.tmdbId,
    title: radarrMovie.title,
    poster_path: radarrMovie.images.find(img => img.coverType === 'poster')?.url || '',
    overview: radarrMovie.overview,
    release_date: radarrMovie.releaseDate || '',
    vote_average: 0,
    images: radarrMovie.images,
  };
}

export async function getMovieByTmdbId(tmdbId: number): Promise<RadarrMovie[] | null> {
  console.log('2');
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Radarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/movie?tmdbId=${tmdbId}`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('获取电影详情失败:', error);
    throw error;
  }
}

export async function getRadarrMovieTmdbIds(): Promise<number[]> {
  try {
    const movies = await fetchRadarrMovies();
    return movies.map(movie => movie.tmdbId);
  } catch (error) {
    console.error('获取 Radarr 电影 tmdbID 失败:', error);
    throw error;
  }
} 