import { LanguageCode } from '@shared/models';

export interface SearchMultiInput {
  page: number;
  language: LanguageCode;
  includeAdult: boolean;
  query?: string;
}

export interface SearchMovieInput extends SearchMultiInput {
  primaryReleaseYear: number;
  region: string;
  year: number;
}

export interface SearchTvInput extends SearchMultiInput {
  firstAirDateYear: number;
}

export interface DiscoverMoviesInput {
  includeAdult: boolean;
  language: LanguageCode;
  page: number;
  primaryReleaseYear?: number;
  region?: string;
  year?: number;
}

export interface DiscoverTvInput {
  includeAdult: boolean;
  language: LanguageCode;
  page: number;
  firstAirDateYear?: number;
}
