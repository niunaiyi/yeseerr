/* eslint-disable @typescript-eslint/no-explicit-any */
import { Media, MediaType } from '@/types/Media';

interface SonarrConfig {
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

const config: SonarrConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SONARR_URL || '',
  apiKey: process.env.NEXT_PUBLIC_SONARR_API_KEY || '',
};

export async function fetchRootFolders(): Promise<RootFolder[]> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Sonarr 配置不完整，请检查环境变量');
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

interface AddSeriesRequest {
  title: string;
  qualityProfileId: number;
  rootFolderPath: string;
  tmdbId: number;
  tvdbId: number;
  monitored: boolean;
  addOptions: {
    searchForMissingEpisodes: boolean;
  };
}

interface AddSeriesResponse {
  id: number;
  title: string;
  TmdbId: number;
}

function convertToMediaFormat(media: any): Media {
  return {
    id: media.id,
    title: media.title,
    poster_path:'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/qujVFLAlBnPU9mZElV4NZgL8iXT.jpg',
    overview: media.overview,
    release_date: media.firstAired || '',
    vote_average: media.ratings?.value || 0,
    tmdbId: media.tmdbId,
    tvdbId: media.tvdbId || 0,
    inRadarr: false,
    mediatype: MediaType.MediaTVShow,
  };
}

export async function fetchSonarrSeries(): Promise<Media[]> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Sonarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/series`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`获取剧集列表失败: ${response.statusText}`);
    }

    const data = await response.json();
    const tvshowWithTvdbId = data.map((series: any) => {
      return {
        ...series,
        tvdbId: series.tvdbId || '',
      };
    });
    return tvshowWithTvdbId.map(convertToMediaFormat);
  } catch (error) {
    console.error('获取剧集列表失败:', error);
    throw error;
  }
}

export async function getSeriesByTmdbId(TmdbId: number): Promise<Media[] | null> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Sonarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/series/lookup?term=Tmdb:${TmdbId}`, {
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`获取剧集信息失败: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      return null;
    }

    return data.map(convertToMediaFormat);
  } catch (error) {
    console.error('获取剧集信息失败:', error);
    throw error;
  }
}

export async function getSonarrTmdbIds(): Promise<number[]> {
  try {
    const medias = await fetchSonarrSeries();
    return medias.map((series: any) => series.tmdbId);
  } catch (error) {
    console.error('获取剧集ID列表失败:', error);
    throw error;
  }
}

export async function addTVShowToSonarr(series: AddSeriesRequest): Promise<AddSeriesResponse> {
  if (!config.baseUrl || !config.apiKey) {
    throw new Error('Sonarr 配置不完整，请检查环境变量');
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/v3/series`, {
      method: 'POST',
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(series),
    });

    if (!response.ok) {
      throw new Error(`添加剧集失败: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      title: data.title,
      TmdbId: data.TmdbId,
    };
  } catch (error) {
    console.error('添加剧集失败:', error);
    throw error;
  }
}

export function getDefaultAddTVShowParams(tmdbId: number, title: string, tvdbId: number): AddSeriesRequest {
  return {
    title,
    qualityProfileId: 1, // 默认质量配置ID
    rootFolderPath: '/media', // 默认根文件夹路径
    tmdbId,
    tvdbId,
    monitored: true,
    addOptions: {
      searchForMissingEpisodes: true,
    },
  };
} 