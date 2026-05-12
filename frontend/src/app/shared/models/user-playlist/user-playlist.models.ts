export type Playlist = OfflinePlaylist | PlaylistDto;
export type PlaylistContent = OfflinePlaylistContent | PlaylistContentDto;

export interface ServerResponse<T> {
  message: string;
  details: T;
  success: boolean;
}

export interface OfflinePlaylistContent {
  trackId: string;
}

export interface OfflinePlaylist {
  id: string;
  name: string;
  items: OfflinePlaylistContent[];
  lastEditTimestamp: string;
  toBeRenamed: boolean;
  toBeDeleted: boolean;
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
  deletedOn?: string | null,
  items: PlaylistContentDto[];
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
