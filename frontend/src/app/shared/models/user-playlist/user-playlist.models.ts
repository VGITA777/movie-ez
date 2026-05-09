export interface ServerResponse<T> {
  message: string;
  details: T;
  success: boolean;
}

export interface OfflinePlaylistContent {
  trackId: string;
}

export interface OfflinePlaylist {
  name: string;
  items: OfflinePlaylistContent[];
  lastEditTimestamp: string;
}

export interface PlaylistContentDto extends OfflinePlaylistContent {
  id: string;
  playlistId: string;
}

export interface PlaylistDto extends OfflinePlaylist {
  id: string;
  userId: string;
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
