import { RadarrMovie } from '@/types/RadarrMovie';

interface RadarrConfig {
  baseUrl: string;
  apiKey: string;
}

interface RootFolder {
  path: string;
  accessible: boolean;
  freeSpace: number;
  unmappedFolders: {
    name: string;
    path: string;
  }[];
  id: number;
}

interface AddMovieRequest {
  title: string;
  qualityProfileId: number;
  rootFolderPath: string;
  tmdbId: number;
  monitored: boolean;
  addOptions: {
    searchForMovie: boolean;
  };
}

interface AddMovieResponse {
  id: number;
  title: string;
  path: string;
  monitored: boolean;
  qualityProfileId: number;
  rootFolderPath: string;
  tmdbId: number;
  imdbId: string;
  overview: string;
  images: {
    coverType: string;
    url: string;
  }[];
  releaseDate: string;
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


export async function fetchRootFolders(): Promise<RootFolder[]> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Radarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/rootfolder`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`获取根文件夹失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取根文件夹失败:', error);
    throw error;
  }
}

export async function addMovieToRadarr(movie: AddMovieRequest): Promise<AddMovieResponse> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Radarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/movie`, {
      method: 'POST',
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`添加电影失败: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('添加电影失败:', error);
    throw error;
  }
}

// 获取默认的添加电影参数
export function getDefaultAddMovieParams(tmdbId: number, title: string): AddMovieRequest {
  return {
    title,
    qualityProfileId: 1, // 默认质量配置ID
    rootFolderPath: '/media', // 默认根文件夹路径
    tmdbId,
    monitored: true,
    addOptions: {
      searchForMovie: true,
    },
  };
} 