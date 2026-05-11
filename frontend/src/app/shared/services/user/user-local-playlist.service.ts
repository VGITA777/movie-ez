import { computed, Injectable, Signal, WritableSignal } from '@angular/core';
import { OfflinePlaylist, OfflinePlaylistContent, Playlist } from '@shared/models';
import { storage } from '@signality/core';
import { Serializer } from '@signality/core/browser/storage';
import { Observable, of } from 'rxjs';

export interface PlaylistService {
  createPlaylist(name: string, items?: string[]): Observable<Playlist>;
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
          lastEditTimestamp: this.normalizeTimestamp(playlist.lastEditTimestamp),
          items: playlist.items
            .filter((content) => this.isValidContent(content))
            .map((content) => ({
              trackId: content.trackId.trim(),
            })),
          toBeRenamed: playlist.toBeRenamed,
          toBeDeleted: playlist.toBeDeleted,
        }));
    } catch {
      return [];
    }
  };

  private normalizeTimestamp(value: unknown): string {
    return typeof value === 'string' && value.trim() !== '' ? value : new Date().toISOString();
  }

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

  public readonly playlists: Signal<OfflinePlaylist[]> = computed(() => {
    return this.userPlaylist().filter((playlist) => !playlist.toBeDeleted);
  });
  public readonly allPlaylists: Signal<OfflinePlaylist[]> = this.userPlaylist.asReadonly();

  constructor() {
    this.verifyPlaylists();
  }

  public renamePlaylist(oldName: string, newName: string): Observable<Playlist | null> {
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

    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(oldNameTrimmed);
    if (!currentPlaylist) {
      return of(null);
    }

    const newPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      name: newNameTrimmed,
      toBeRenamed: true,
      lastEditTimestamp: this.nowIso(),
    };

    this.updateExistingPlaylist(oldNameTrimmed, newPlaylist);
    return of(newPlaylist);
  }

  public createPlaylist(name: string, items?: string[]): Observable<OfflinePlaylist> {
    const existing: OfflinePlaylist | null = this.findPlaylist(name);

    if (existing && !existing.toBeDeleted) {
      return of(existing);
    }

    if (existing && existing.toBeDeleted) {
      const newPlaylist: OfflinePlaylist = {
        ...existing,
        items: items?.map((trackId) => ({ trackId })) ?? [],
        lastEditTimestamp: this.nowIso(),
        toBeDeleted: false,
      };
      this.updateExistingPlaylist(name, newPlaylist);
      return of(newPlaylist);
    }

    const newPlaylist: OfflinePlaylist = {
      name: name,
      items: items?.map((trackId) => ({ trackId })) ?? [],
      lastEditTimestamp: this.nowIso(),
      toBeRenamed: false,
      toBeDeleted: false,
    };
    this.userPlaylist.update((playlists) => [...playlists, newPlaylist]);
    return of(newPlaylist);
  }

  public deletePlaylist(name: string): Observable<void> {
    this.userPlaylist.update((playlists) => {
      const index: number = playlists.findIndex((playlist) => playlist.name === name);
      if (index === -1) {
        return playlists;
      }
      const updated: OfflinePlaylist[] = [...playlists];
      updated[index] = {
        ...updated[index],
        toBeDeleted: true,
      };
      return updated;
    });
    this.verifyPlaylists();
    return of();
  }

  getPlaylist(playlistName: string): Observable<OfflinePlaylist | null> {
    return of(this.findPlaylist(playlistName));
  }

  public removeFromPlaylist(
    playlistName: string,
    trackId: string,
  ): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(playlistName);
    if (!currentPlaylist) {
      return of(null);
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: currentPlaylist.items.filter((content) => content.trackId !== trackId),
      lastEditTimestamp: this.nowIso(),
    };
    this.updateExistingPlaylist(playlistName, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public addToPlaylist(playlistName: string, trackId: string): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(playlistName);
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
      lastEditTimestamp: this.nowIso(),
    };
    this.updateExistingPlaylist(playlistName, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public deletePermanently(name: string): void {
    this.userPlaylist.update((playlists) => playlists.filter((playlist) => playlist.name !== name));
  }

  public deleteAllPlaylists(): void {
    this.userPlaylist.update((playlists) => {
      const newPlaylists: OfflinePlaylist[] = playlists.map((playlist) => ({
        ...playlist,
        toBeDeleted: true,
      }));
      return newPlaylists;
    });
  }

  public deleteAllPlaylistsPermanently(): void {
    this.userPlaylist.set([]);
  }

  public setPlaylistRenameFlag(name: string, flag: boolean): void {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(name);
    if (!currentPlaylist) {
      return;
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      toBeRenamed: flag,
    };
    this.updateExistingPlaylist(name, updatedPlaylist);
  }

  public setPlaylistDeleteFlag(name: string, flag: boolean): void {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylist(name);
    if (!currentPlaylist) {
      return;
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      toBeDeleted: flag,
    };
    this.updateExistingPlaylist(name, updatedPlaylist);
  }

  private findPlaylist(name: string): OfflinePlaylist | null {
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
        lastEditTimestamp: this.nowIso(),
        items: [...newPlaylist.items],
      };
      return updated;
    });

    this.verifyPlaylists();
  }

  private normalizeTimestamp(value: string | undefined): string {
    return value && value.trim() !== '' ? value : this.nowIso();
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
        lastEditTimestamp: this.normalizeTimestamp(playlist.lastEditTimestamp),
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

  private nowIso(): string {
    return new Date().toISOString();
  }
}
