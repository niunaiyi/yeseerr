/* eslint-disable @typescript-eslint/no-explicit-any */

import { Media, MediaType } from "@/types/Media";

export interface TVShowResponse {
  results: Media[];
  page: number;
  total_pages: number;
  total_results: number;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// 将 TMDB 电影数据转换为通用电影格式
function convertToMediaFormat(media: any): Media {
  return {
    id: media.id,
    title: media.name,
    poster_path: `https://media.themoviedb.org/t/p/w220_and_h330_face${media.poster_path}`,
    overview: media.overview,
    release_date: media.release_date || media.first_air_date,
    vote_average: media.vote_average,
    tmdbId: media.id,
    imdbId: '',
    inRadarr: false,
    mediatype: MediaType.MediaTVShow,
  };
}

export async function fetchTVShows(page: number = 1, parameter: string = 'popular'): Promise<TVShowResponse> {
  if (!API_KEY) {
    throw new Error('TMDB API key 未配置');
  }

  let url = '';
  if(['popular', 'top_rated', 'now_playing'].includes(parameter)) {
     url = `${BASE_URL}/tv/${parameter}?api_key=${API_KEY}&language=zh-CN&page=${page}`;
  }
  else{
    url = `https://api.themoviedb.org/3/discover/tv?region=US&with_networks=${parameter}&language=zh-CN&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`;
  }

  console.log('url', url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`获取电视剧列表失败: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    results: data.results.map(convertToMediaFormat)
  }
}

export async function searchTVShows(query: string, page: number = 1): Promise<TVShowResponse> {
  if (!API_KEY) {
    throw new Error('TMDB API key 未配置');
  }

  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=zh-CN&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  if (!response.ok) {
    throw new Error(`搜索电视剧失败: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    results: data.results.map(convertToMediaFormat)
  };
}
