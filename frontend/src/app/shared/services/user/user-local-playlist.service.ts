import { Injectable, Signal, WritableSignal } from '@angular/core';
import {
  OfflinePlaylist,
  OfflinePlaylistContent,
  PlaylistContentDto,
  PlaylistDto,
} from '@shared/models';
import { storage } from '@signality/core';
import { Serializer } from '@signality/core/browser/storage';
import { Observable, of } from 'rxjs';

export type Playlist = OfflinePlaylist | PlaylistDto;
export type PlaylistContent = OfflinePlaylistContent | PlaylistContentDto;

export interface PlaylistService {
  createPlaylist(name: string): Observable<Playlist>;
  deletePlaylist(name: string): Observable<void>;
  getPlaylist(playlistName: string): Observable<Playlist | null>;
  removeFromPlaylist(playlistName: string, trackId: string): Observable<Playlist | null>;
  addToPlaylist(playlistName: string, trackId: string): Observable<Playlist | null>;
  renamePlaylist(oldName: string, newName: string): Observable<Playlist | null>;
}

class LocalUserPlaylistsSerializer implements Serializer<OfflinePlaylist[]> {
  write: (value: OfflinePlaylist[]) => string = (value) => JSON.stringify(value);
  read: (raw: string) => OfflinePlaylist[] = (raw): OfflinePlaylist[] => {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((playlist) => this.isValidPlaylist(playlist))
        .map((playlist) => ({
          name: playlist.name.trim(),
          items: playlist.items
            .filter((content) => this.isValidContent(content))
            .map((content) => ({
              trackId: content.trackId.trim(),
            })),
        }));
    } catch {
      return [];
    }
  };

  private isValidPlaylist(playlist: any): playlist is OfflinePlaylist {
    if (!playlist || typeof playlist.name !== 'string' || playlist.name.trim() === '') {
      return false;
    }
    return Array.isArray(playlist.items);
  }

  private isValidContent(content: any): content is OfflinePlaylistContent {
    return !!content && typeof content.trackId === 'string' && content.trackId.trim() !== '';
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserLocalPlaylistService implements PlaylistService {
  private readonly userPlaylist: WritableSignal<OfflinePlaylist[]> = storage(
    'offlinePlaylist',
    [],
    {
      serializer: new LocalUserPlaylistsSerializer(),
    },
  );

  public readonly playlists: Signal<OfflinePlaylist[]> = this.userPlaylist.asReadonly();

  constructor() {
    this.verifyPlaylists();
  }

  renamePlaylist(oldName: string, newName: string): Observable<Playlist | null> {
    const oldNameTrimmed: string = oldName.trim() ?? '';
    const newNameTrimmed: string = newName.trim() ?? '';

    if (oldNameTrimmed === '' || newNameTrimmed === '' || newNameTrimmed.length > 25) {
      console.debug(
        `Cannot rename playlist. Invalid name. Old name: "${oldName}", New name: "${newName}"`,
      );
      return of(null);
    }

    if (this.doesPlaylistExists(newNameTrimmed)) {
      console.debug(
        `Cannot rename playlist. A playlist with the new name already exists. New name: "${newNameTrimmed}"`,
      );
      return of(null);
    }

    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistSync(oldNameTrimmed);
    if (!currentPlaylist) {
      return of(null);
    }

    const newPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      name: newNameTrimmed,
    };

    this.updateExistingPlaylist(oldNameTrimmed, newPlaylist);
    return of(newPlaylist);
  }

  createPlaylist(name: string): Observable<OfflinePlaylist> {
    const existing: OfflinePlaylist | null = this.findPlaylistSync(name);
    if (existing) {
      return of(existing);
    }

    const newPlaylist: OfflinePlaylist = {
      name: name,
      items: [],
    };
    this.userPlaylist.update((playlists) => [...playlists, newPlaylist]);
    return of(newPlaylist);
  }

  deletePlaylist(name: string): Observable<void> {
    this.userPlaylist.update((playlists) => [
      ...playlists.filter((playlist) => playlist.name !== name),
    ]);
    this.verifyPlaylists();
    return of();
  }

  getPlaylist(playlistName: string): Observable<OfflinePlaylist | null> {
    return of(this.findPlaylistSync(playlistName));
  }

  removeFromPlaylist(playlistName: string, trackId: string): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistSync(playlistName);
    if (!currentPlaylist) {
      return of(null);
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: currentPlaylist.items.filter((content) => content.trackId !== trackId),
    };
    this.updateExistingPlaylist(playlistName, updatedPlaylist);
    return of(updatedPlaylist);
  }

  addToPlaylist(playlistName: string, trackId: string): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistSync(playlistName);
    if (!currentPlaylist) {
      return of(null);
    }

    if (currentPlaylist.items.some((content) => content.trackId === trackId)) {
      return of(currentPlaylist);
    }

    const newContent: OfflinePlaylistContent = {
      trackId,
    };
    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: [...currentPlaylist.items, newContent],
    };
    this.updateExistingPlaylist(playlistName, updatedPlaylist);
    return of(updatedPlaylist);
  }

  private findPlaylistSync(name: string): OfflinePlaylist | null {
    const playlist: Playlist | undefined = this.userPlaylist().find(
      (playlist) => playlist.name === name,
    );
    if (!playlist) {
      return null;
    }
    return playlist as OfflinePlaylist;
  }

  private updateExistingPlaylist(name: string, newPlaylist: OfflinePlaylist): void {
    this.userPlaylist.update((playlists) => {
      const playlistIndex: number = playlists.findIndex((playlist) => playlist.name === name);

      if (playlistIndex === -1) {
        return playlists;
      }

      const updated: OfflinePlaylist[] = [...playlists];
      updated[playlistIndex] = {
        ...newPlaylist,
        items: [...newPlaylist.items],
      };
      return updated;
    });

    this.verifyPlaylists();
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

  public deleteAllPlaylists(): void {
    this.userPlaylist.set([]);
  }
}
