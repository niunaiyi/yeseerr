export enum MediaType {
  MediaMovie = 'movie',
  MediaTVShow = 'tvshow',
  MediaRadarr = 'radarr',
  MediaPorn = 'porn',
}


export interface Media {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: number;    
    tmdbId: number;
    imdbId: string;  
    inRadarr?: boolean;
    mediatype: MediaType;
  }

