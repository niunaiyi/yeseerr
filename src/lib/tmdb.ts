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

export async function fetchMovies(page: number = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?language=zh-CN&sort_by=popularity.desc&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`);
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