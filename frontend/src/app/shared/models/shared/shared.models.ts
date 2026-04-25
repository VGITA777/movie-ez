import { MediaType } from '@shared/models';

export interface Genre {
  id: number;
  name: string;
}

export interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ImagesModel {
  id: number;
  backdrops: Image[];
  posters: Image[];
  logos: Image[];
}

export interface Keyword {
  id: number;
  name: string;
}

export interface Keywords {
  id: number;
  keywords: Keyword[];
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface VideosModel {
  id: number;
  results: Video[];
}

export interface CreditsCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CreditsCrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface CreditsModel {
  id: number;
  cast: CreditsCast[];
  crew: CreditsCrew[];
}

export interface MediaDetailsModel {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  homepage: string;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
}

export interface MediaShortDetailsModel {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface MediaShortDetailsWithMediaTypeModel extends MediaShortDetailsModel {
  media_type: MediaType;
}

export interface Page<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}
