export interface ServerResponse<T> {
  message: string;
  details: T;
  success: boolean;
}

export interface PlaylistContentDto {
  id: string;
  playlistId: string;
  trackId: string;
}

export interface PlaylistDto {
  id: string;
  userId: string;
  name: string;
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

