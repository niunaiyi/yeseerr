interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(page: number = 1, type: 'popular' | 'top_rated' | 'now_playing' = 'popular'): Promise<MovieResponse> {
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
    return data;
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
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
} 