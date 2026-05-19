import { ToastT } from '@spartan-ng/brain/sonner';

export const USER_LOCAL_STORAGE_PLAYLIST_KEY = 'offlinePlaylist';
export const PLAYLIST_SORT_OPTION_STORAGE_KEY = 'playlistsSortingOption';

export const DEFAULT_PLAYLIST_CONFIG: Omit<ToastT, 'id' | 'type' | 'title'> = {
  position: 'top-right',
  duration: 3000,
};
export const MAX_PLAYLIST_NAME_LENGTH = 25;
