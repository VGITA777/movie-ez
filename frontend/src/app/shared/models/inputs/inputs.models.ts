import { LanguageCode, MediaType, OfflinePlaylist, OfflinePlaylistContent } from '@shared/models';

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

export interface GetUserPlaylistInput {
  id: string;
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
  items?: OfflinePlaylistContent[];
}

export interface AddTrackToPlaylistInput {
  playlistId: string;
  trackId: string;
  mediaType: MediaType;
}

export interface AddTracksToPlaylistInput {
  playlistId: string;
  items: OfflinePlaylistContent[];
}

export interface DeletePlaylistInput {
  playlistId: string;
}

export interface DeleteAllTracksFromPlaylistInput {
  playlistId: string;
  items: OfflinePlaylistContent[];
}

export interface DeleteTrackFromPlaylistInput {
  playlistId: string;
  trackId: string;
  mediaType: MediaType;
}

export interface PlaylistUpdateInput {
  newName?: string | null;

  /**
   * Full replacement list.
   */
  newTracks?: OfflinePlaylistContent[] | null;

  /**
   * Incremental removals.
   */
  tracksToRemove?: OfflinePlaylistContent[] | null;

  /**
   * Incremental additions.
   */
  tracksToAdd?: OfflinePlaylistContent[] | null;
}

export interface PlaylistInput {
  id: string;
  name: string;
  items: OfflinePlaylistContent[];
}

export interface CreatePlaylistsInput {
  playlists: PlaylistInput[];
}

export interface PlaylistAndTracksInput {
  playlistId: string;
  items: OfflinePlaylistContent[];
}

export interface PlaylistTracksInput {
  items: OfflinePlaylistContent[];
}

export interface PlaylistSyncInput {
  playlists: OfflinePlaylist[];
}
