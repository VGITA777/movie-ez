import { Injectable, WritableSignal } from '@angular/core';
import {
  OfflinePlaylist,
  OfflinePlaylistContent,
  PlaylistContentDto,
  PlaylistDto,
} from '@shared/models';
import { storage } from '@signality/core';

export type Playlist = OfflinePlaylist | PlaylistDto;
export type PlaylistContent = OfflinePlaylistContent | PlaylistContentDto;

export interface PlaylistService {
  createPlaylist(name: string): Playlist;
  getPlaylist(playlistName: string): Playlist | null;
  removeFromPlaylist(playlistName: string, trackId: string): Playlist | null;
  addToPlaylist(playlistName: string, trackId: string): Playlist | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserLocalPlaylistService implements PlaylistService {
  private readonly userPlaylist: WritableSignal<OfflinePlaylist[]> = storage('offlinePlaylist', []);

  constructor() {
    this.verifyPlaylists();
  }

  createPlaylist(name: string): OfflinePlaylist {
    if (this.doesPlaylistExists(name)) {
      return this.findPlaylist(name) as OfflinePlaylist;
    }
    const newPlaylist: OfflinePlaylist = {
      name: name,
      items: [],
    };
    this.userPlaylist.update((playlists) => [...playlists, newPlaylist]);
    return newPlaylist;
  }

  getPlaylist(playlistName: string): OfflinePlaylist | null {
    return this.findPlaylist(playlistName);
  }

  removeFromPlaylist(playlistName: string, trackId: string): OfflinePlaylist | null {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(playlistName);
    if (!currentPlaylist) {
      return null;
    }

    currentPlaylist.items = currentPlaylist.items.filter((content) => content.trackId !== trackId);
    this.updateExistingPlaylist(playlistName, currentPlaylist);
    return currentPlaylist;
  }

  addToPlaylist(playlistName: string, trackId: string): OfflinePlaylist | null {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(playlistName);
    if (!currentPlaylist) {
      return null;
    }

    if (currentPlaylist.items.some((content) => content.trackId === trackId)) {
      return currentPlaylist;
    }

    const newContent: OfflinePlaylistContent = {
      trackId,
    };
    currentPlaylist.items.push(newContent);
    this.updateExistingPlaylist(playlistName, currentPlaylist);
    return currentPlaylist;
  }

  private findPlaylist(name: string): OfflinePlaylist | null {
    const playlist: Playlist | undefined = this.userPlaylist().find(
      (playlist) => playlist.name === name,
    );
    if (!playlist) {
      return null;
    }
    return playlist;
  }

  private updateExistingPlaylist(name: string, newPlaylist: OfflinePlaylist) {
    this.userPlaylist.update((playlists) => {
      const playlistIndex = playlists.findIndex((playlist) => playlist.name === name);

      if (playlistIndex === -1) {
        return playlists;
      }

      playlists[playlistIndex] = newPlaylist;
      return playlists;
    });
  }

  private doesPlaylistExists(name: string): boolean {
    return this.userPlaylist().some((playlist) => playlist.name === name);
  }

  private verifyPlaylists(): void {
    const playlists: OfflinePlaylist[] = this.userPlaylist();
    const cleanedPlaylists: OfflinePlaylist[] = playlists
      .filter((playlist) => this.isValidPlaylist(playlist))
      .map((playlist) => ({
        ...playlist,
        items: playlist.items.filter((content) => this.isValidPlaylistContent(content)),
      }));

    if (cleanedPlaylists.length !== playlists.length) {
      this.userPlaylist.set(cleanedPlaylists);
      return;
    }

    const hasInvalidContent: boolean = cleanedPlaylists.some(
      (playlist, index) => playlist.items.length !== playlists[index]?.items?.length,
    );
    if (hasInvalidContent) {
      this.userPlaylist.set(cleanedPlaylists);
    }
  }

  private isValidPlaylist(
    playlist: OfflinePlaylist | null | undefined,
  ): playlist is OfflinePlaylist {
    if (!playlist || typeof playlist.name !== 'string' || playlist.name.trim() === '') {
      return false;
    }
    return Array.isArray(playlist.items);
  }

  private isValidPlaylistContent(
    content: OfflinePlaylistContent | null | undefined,
  ): content is OfflinePlaylistContent {
    return !!content && typeof content.trackId === 'string' && content.trackId.trim() !== '';
  }
}
