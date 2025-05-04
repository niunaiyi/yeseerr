/* eslint-disable @typescript-eslint/no-explicit-any */

import { Media, MediaType} from '@/types/Media';

interface MovieResponse {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

// 将 TMDB 电影数据转换为通用电影格式
function convertToMediaFormat(media: any): Media {
  return {
    id: media.id,
    title: media.title || media.name,
    poster_path: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
    overview: media.overview,
    release_date: media.release_date || media.first_air_date,
    vote_average: media.vote_average,
    tmdbId: media.id,
    imdbId: '',
    inRadarr: false,
    mediatype: MediaType.MediaMovie,
  };
}

// 电影相关函数
export async function fetchMovies(page: number = 1, type: 'popular' | 'top_rated' | 'on_the_air'): Promise<MovieResponse> {
  try {
    const endpoint = type === 'popular' 
      ? 'movie/popular'
      : type === 'top_rated'
      ? 'movie/top_rated'
      : 'movie/now_playing';
      
    const response = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?language=zh-CN&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('获取电影数据失败');
    }
    const data = await response.json();
    return {
      ...data,
      results: data.results.map(convertToMediaFormat)
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=zh-CN&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('搜索电影失败');
    }
    const data = await response.json();
    return {
      ...data,
      results: data.results.map(convertToMediaFormat)
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

// TV 相关函数
export async function fetchTVShows(page: number = 1, type: 'popular' | 'top_rated' | 'on_the_air' = 'popular'): Promise<MovieResponse> {
  try {
    const endpoint = type === 'popular' 
      ? 'tv/popular'
      : type === 'top_rated'
      ? 'tv/top_rated'
      : 'tv/on_the_air';
      
    const response = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?language=zh-CN&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('获取电视剧数据失败');
    }
    const data = await response.json();
    return {
      ...data,
      results: data.results.map(convertToMediaFormat)
    };
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    throw error;
  }
}

export async function searchTVShows(query: string, page: number = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?language=zh-CN&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('搜索电视剧失败');
    }
    const data = await response.json();
    return {
      ...data,
      results: data.results.map(convertToMediaFormat)
    };
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
} 