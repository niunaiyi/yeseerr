/* eslint-disable @typescript-eslint/no-explicit-any */

import { Media, MediaType } from '@/types/Media';

interface MovieResponse {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';

// 将 TMDB 电影数据转换为通用电影格式
function convertToMediaFormat(media: any): Media {
  return {
    id: media.id,
    title: media.title || media.name,
    poster_path: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
    overview: media.overview,
    release_date: media.release_date || media.first_air_date || '',
    vote_average: media.vote_average,
    tmdbId: media.id,
    tvdbId: 0,
    inRadarr: false,
    mediatype: MediaType.MediaMovie,
  };
}

// 电影相关函数
export async function fetchMovies(page: number = 1, parameter: string = 'popular'): Promise<MovieResponse> {
  try {

    let parameters = '';
    let endpoint = '';
    if (['popular', 'top_rated', 'now_playing'].includes(parameter)) {
      endpoint = `movie/${parameter}`;
      parameters = new URLSearchParams({
        language: "zh-CN",
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
        page: `${page}`,
      }).toString();      
    }
    else {      
      endpoint = 'discover/movie';
      parameters = new URLSearchParams({
        watch_region: 'US',
        with_watch_providers: '2|8|15|384|12|49|55|531|337|453|2739|213|1024|4353',
        language: "zh-CN",
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
        page: `${page}`,
      }).toString();
    }

    const url = `${BASE_URL}/${endpoint}?${parameters}`;
    console.log('parameter', parameter);
    console.log('url', url);

    const response = await fetch(`${BASE_URL}/${endpoint}?${parameters}`);
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
    const params = new URLSearchParams({
      language: "zh-CN",
      api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
      query: encodeURIComponent(query),
      page: `${page}`,
    }).toString();

    const response = await fetch(
      `${BASE_URL}/search/movie?${params}`
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