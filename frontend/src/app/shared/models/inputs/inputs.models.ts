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
  id: string;
}

export interface CreateUserPlaylistInput {
  name: string;
  playlistId: string;
  trackIds?: string[];
}

export const defaultCreateUserPlaylistInput: CreateUserPlaylistInput = {
  name: '',
  playlistId: crypto.randomUUID(),
  trackIds: [],
};

export interface AddTrackToPlaylistInput {
  playlistId: string;
  trackId: string;
}

export interface AddTracksToPlaylistInput {
  playlistId: string;
  tracksIds: string[];
}

export interface DeletePlaylistInput {
  playlistId: string;
}

export interface DeleteAllTracksFromPlaylistInput {
  playlistId: string;
  trackIds: string[];
}

export interface DeleteTrackFromPlaylistInput {
  playlistId: string;
  trackId: string;
}

export interface PlaylistUpdateInput {
  newName?: string | null;
  newTracks?: string[] | null;
  tracksToRemove?: string[] | null;
  tracksToAdd?: string[] | null;
}

export interface PlaylistInput {
  id: string;
  name: string;
  trackIds: string[];
}

export interface CreatePlaylistsInput {
  playlists: PlaylistInput[];
}

export interface PlaylistAndTracksInput {
  playlistId: string;
  trackIds: string[];
}

export interface PlaylistTracksInput {
  tracksIds: string[];
}
