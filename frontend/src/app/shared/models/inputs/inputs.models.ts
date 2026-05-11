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
  page: number;
  language?: LanguageCode;
  region?: string;
}

export interface TvSeriesListsInput {
  page: number;
  language?: LanguageCode;
  timezone?: string;
}

export interface GetUserPlaylistInput {
  name: string;
}

export interface CreateUserPlaylistInput {
  name: string;
  trackIds?: string[];
}

export interface AddTrackToPlaylistInput {
  name: string;
  trackId: string;
}

export interface AddTracksToPlaylistInput {
  name: string;
  trackIds: string[];
}

export interface DeletePlaylistInput {
  name: string;
}

export interface DeleteAllTracksFromPlaylistInput {
  name: string;
  trackIds: string[];
}

export interface DeleteTrackFromPlaylistInput {
  name: string;
  trackId: string;
}

export interface PlaylistUpdateInput {
  newName?: string | null;
  newTracks?: string[] | null;
  tracksToRemove?: string[] | null;
  tracksToAdd?: string[] | null;
}

export interface PlaylistInput {
  name: string;
  trackIds: string[];
}

export interface CreatePlaylistsInput {
  playlists: PlaylistInput[];
}
