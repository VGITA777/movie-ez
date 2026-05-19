import { MediaType } from '@shared/models';

export type Playlist = OfflinePlaylist | PlaylistDto;
export type PlaylistContent = OfflinePlaylistContent | PlaylistContentDto;

export interface ServerResponse<T> {
  message: string;
  details: T;
  success: boolean;
}

/**
 * Local/offline playlist content.
 *
 * TMDB IDs are not globally unique across media types.
 * Example:
 * - movie 123
 * - tv 123
 *
 * Because of that, playlist content identity is:
 * trackId + mediaType
 */
export interface OfflinePlaylistContent {
  trackId: string;
  mediaType: MediaType;
  addedOn: string;
}

/**
 * Local/offline playlist used for IndexedDB/localStorage and sync.
 *
 * createdOn is mandatory because offline-created playlists should keep
 * their original local creation time after they are synced to the backend.
 */
export interface OfflinePlaylist {
  id: string;
  name: string;
  items: OfflinePlaylistContent[];
  createdOn: string;
  lastEditTimestamp: string;
  deletedOn?: string | null;
}

export interface PlaylistContentDto extends OfflinePlaylistContent {
  id: string;
  playlistId: string;
}

export interface PlaylistDto {
  id: string;
  userId: string;
  name: string;
  lastEditTimestamp: string;
  createdOn: string;
  deletedOn?: string | null;
  items: PlaylistContentDto[];
}

export interface PlaylistIdMapping {
  localId: string;
  canonicalServerId: string;
}

export interface PlaylistSyncResponse {
  playlists: PlaylistDto[];
  idMappings: PlaylistIdMapping[];
  serverSyncedAt?: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  playlists: PlaylistDto[];
}

export interface UserSummaryDto {
  id: string;
  username: string;
  email: string;
}
