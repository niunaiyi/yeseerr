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
    release_date: radarrMovie.physicalRelease || radarrMovie.digitalRelease || '',
    vote_average: 0, // Radarr 不提供评分信息
    status: radarrMovie.status,
    downloaded: radarrMovie.downloaded,
    sizeOnDisk: radarrMovie.sizeOnDisk,
  };
} 