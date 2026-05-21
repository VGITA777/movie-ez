import { ToastT } from '@spartan-ng/brain/sonner';

export const USER_LOCAL_STORAGE_PLAYLIST_KEY: string = 'offlinePlaylist';
export const PLAYLIST_SORT_OPTION_STORAGE_KEY: string = 'playlistsSortingOption';
export const PLAYLIST_CONTENTS_SORT_OPTION_STORAGE_KEY: string = 'playlistContentsSortingOption';
export const UUID_REGEX: RegExp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const PLACEHOLDER_EMPTY_PLAYLIST_PATH: string = '/images/placeholder-poster.png';

export const DEFAULT_PLAYLIST_CONFIG: Omit<ToastT, 'id' | 'type' | 'title'> = {
  position: 'top-right',
  duration: 3000,
};
export const MAX_PLAYLIST_NAME_LENGTH: number = 25;
