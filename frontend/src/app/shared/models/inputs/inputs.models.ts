import { LanguageCode } from '@shared/models';

export interface SearchMultiInput {
  page: number;
  language?: LanguageCode;
  includeAdult?: boolean;
  query?: string;
}

export interface SearchMovieInput extends SearchMultiInput {
  primaryReleaseYear?: number;
  region?: string;
  year?: number;
}

export interface SearchTvInput extends SearchMultiInput {
  firstAirDateYear?: number;
}

export interface DiscoverMoviesInput {
  page: number;
  includeAdult?: boolean;
  language?: LanguageCode;
  primaryReleaseYear?: number;
  region?: string;
  year?: number;
}

export interface DiscoverTvInput {
  page: number;
  includeAdult?: boolean;
  language?: LanguageCode;
  firstAirDateYear?: number;
}

export interface TvSeasonDetailsInput {
  seriesId: number;
  seasonNumber: number;
  language?: LanguageCode;
}

export interface MovieListsInput {
  language?: LanguageCode;
  page?: number;
  region?: string;
}

export interface TvSeriesListsInput {
  language?: LanguageCode;
  page?: number;
  timezone?: string;
}
