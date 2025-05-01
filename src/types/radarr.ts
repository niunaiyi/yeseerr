export interface RadarrMovie {
  id: number;
  title: string;
  path: string;
  overview: string;
  images: {
    coverType: string;
    url: string;
  }[];
  tmdbId: number;
  imdbId: string;  
  releaseDate: string;
  status: string;
  downloaded: boolean;
  sizeOnDisk: number;
  hasFile: boolean;
  physicalRelease?: string;
  digitalRelease?: string;
} 