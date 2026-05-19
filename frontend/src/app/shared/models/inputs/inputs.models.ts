import { LanguageCode, MediaType, OfflinePlaylist } from '@shared/models';

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

/**
 * Create/add payload.
 *
 * Backend requires all 3 fields:
 * - trackId
 * - mediaType
 * - addedOn
 */
export interface PlaylistTrackInfoInput {
  trackId: string;
  mediaType: MediaType;
  addedOn: string;
}

/**
 * Delete/remove payload.
 *
 * Deleting does not need addedOn.
 * It only needs the content identity.
 */
export interface PlaylistTrackIdentityInput {
  trackId: string;
  mediaType: MediaType;
}

export interface CreateUserPlaylistInput {
  playlistId: string;
  name: string;
  createdOn: string;
  tracks?: PlaylistTrackInfoInput[];
}

export interface AddTrackToPlaylistInput extends PlaylistTrackInfoInput {
  playlistId: string;
}

export interface AddTracksToPlaylistInput {
  playlistId: string;
  tracks: PlaylistTrackInfoInput[];
}

export interface DeletePlaylistInput {
  playlistId: string;
}

export interface DeleteAllTracksFromPlaylistInput {
  playlistId: string;
  tracks: PlaylistTrackIdentityInput[];
}

export interface DeleteTrackFromPlaylistInput extends PlaylistTrackIdentityInput {
  playlistId: string;
}

export interface PlaylistUpdateInput {
  newName?: string | null;

  /**
   * Full replacement list.
   * Backend requires addedOn for every new/replaced content.
   */
  newTracks?: PlaylistTrackInfoInput[] | null;

  /**
   * Incremental removals.
   * Only trackId + mediaType are needed.
   */
  tracksToRemove?: PlaylistTrackIdentityInput[] | null;

  /**
   * Incremental additions.
   * Backend requires addedOn for every content.
   */
  tracksToAdd?: PlaylistTrackInfoInput[] | null;
}

export interface PlaylistInput {
  id: string;
  name: string;
  createdOn: string;
  tracks: PlaylistTrackInfoInput[];
}

export interface CreatePlaylistsInput {
  playlists: PlaylistInput[];
}

export interface PlaylistTracksInput {
  tracks: PlaylistTrackInfoInput[];
}

export interface PlaylistTrackIdentitiesInput {
  tracks: PlaylistTrackIdentityInput[];
}

export interface PlaylistSyncInput {
  playlists: OfflinePlaylist[];
}
