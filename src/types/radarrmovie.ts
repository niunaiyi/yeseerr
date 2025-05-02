export interface RadarrMovie {
  id: number;
  title: string;
  path: string;
  monitored: boolean;
  overview: string;
  images: {
    coverType: string;
    url: string;
  }[];
  tmdbId: number;
  imdbId: string;  
  releaseDate: string;  
} 

