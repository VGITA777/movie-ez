import { computed, Injectable, Signal, WritableSignal } from '@angular/core';
import { OfflinePlaylist, OfflinePlaylistContent, Playlist } from '@shared/models';
import { storage } from '@signality/core';
import { Serializer } from '@signality/core/browser/storage';
import { Observable, of } from 'rxjs';

export interface PlaylistService {
  createPlaylist(playlistId: string, name: string, items?: string[]): Observable<Playlist>;
  deletePlaylist(playlistId: string): Observable<void>;
  getPlaylist(playlistId: string): Observable<Playlist | null>;
  removeFromPlaylist(playlistId: string, trackId: string): Observable<Playlist | null>;
  addToPlaylist(playlistId: string, trackId: string): Observable<Playlist | null>;
  renamePlaylist(playlistId: string, newName: string): Observable<Playlist | null>;
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
          id: playlist.id ?? crypto.randomUUID(), // Fallback for older playlists without id
          name: playlist.name.trim(),
          lastEditTimestamp: this.normalizeTimestamp(playlist.lastEditTimestamp),
          items: playlist.items
            .filter((content) => this.isValidContent(content))
            .map((content) => ({
              trackId: content.trackId.trim(),
            })),
          toBeDeleted: playlist.deletedOn,
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
    return this.userPlaylist().filter((playlist) => !playlist.deletedOn);
  });
  public readonly allPlaylists: Signal<OfflinePlaylist[]> = this.userPlaylist.asReadonly();

  public renamePlaylist(id: string, newName: string): Observable<Playlist | null> {
    const newNameTrimmed: string = newName.trim() ?? '';
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistById(id);

    if (currentPlaylist && currentPlaylist.name === newNameTrimmed) {
      console.debug(
        `Playlist name is the same as the current one. No need to rename. Playlist id: "${id}", name: "${newNameTrimmed}"`,
      );
      return of(currentPlaylist);
    }

    if (newNameTrimmed === '' || newNameTrimmed.length > 25) {
      console.debug(`Cannot rename playlist. Invalid name. New name: "${newName}"`);
      return of(null);
    }

    if (this.doesPlaylistExistsByName(newNameTrimmed)) {
      console.debug(
        `Cannot rename playlist. A playlist with the new name already exists. New name: "${newNameTrimmed}"`,
      );
      return of(null);
    }

    if (!currentPlaylist) {
      return of(null);
    }

    const newPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      name: newNameTrimmed,
      lastEditTimestamp: this.nowIso(),
    };

    this.updateExistingPlaylistById(id, newPlaylist);
    return of(newPlaylist);
  }

  public createPlaylist(id: string, name: string, items?: string[]): Observable<OfflinePlaylist> {
    const existing: OfflinePlaylist | undefined = this.findPlaylistByName(name.trim());

    if (existing && !existing.deletedOn) {
      return of(existing);
    }

    const newPlaylist: OfflinePlaylist = {
      id,
      name: name.trim(),
      items: items?.map((trackId) => ({ trackId })) ?? [],
      lastEditTimestamp: this.nowIso(),
    };
    this.userPlaylist.update((playlists) => [...playlists, newPlaylist]);
    return of(newPlaylist);
  }

  public deletePlaylist(id: string): Observable<void> {
    this.userPlaylist.update((playlists) => {
      const index: number = playlists.findIndex((playlist) => playlist.id === id);
      if (index === -1) {
        return playlists;
      }
      const updated: OfflinePlaylist[] = [...playlists];
      updated[index] = {
        ...updated[index],
        deletedOn: this.nowIso(),
      };
      return updated;
    });
    return of();
  }

  getPlaylist(id: string): Observable<OfflinePlaylist | null> {
    return of(this.findPlaylistById(id));
  }

  public removeFromPlaylist(id: string, trackId: string): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistById(id);
    if (!currentPlaylist) {
      return of(null);
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: currentPlaylist.items.filter((content) => content.trackId !== trackId),
      lastEditTimestamp: this.nowIso(),
    };
    this.updateExistingPlaylistById(id, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public addToPlaylist(id: string, trackId: string): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistById(id);
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
    this.updateExistingPlaylistById(id, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public deletePermanently(id: string): void {
    this.userPlaylist.update((playlists) => playlists.filter((playlist) => playlist.id !== id));
  }

  public setPlaylistDeleteFlag(id: string, deletedOn: string): void {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistById(id);
    if (!currentPlaylist) {
      return;
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      deletedOn: deletedOn,
    };
    this.updateExistingPlaylistById(id, updatedPlaylist);
  }

  public deleteAllPlaylists(): void {
    this.userPlaylist.update((playlists) => {
      const updated: OfflinePlaylist[] = playlists.map((playlist) => ({
        ...playlist,
        toBeDeleted: true,
      }));
      return updated;
    });
  }

  private findPlaylistById(id: string): OfflinePlaylist | null {
    const playlist: Playlist | undefined = this.userPlaylist().find((entry) => entry.id === id);
    if (!playlist) {
      return null;
    }
    return playlist as OfflinePlaylist;
  }

  private updateExistingPlaylistById(id: string, newPlaylist: OfflinePlaylist): void {
    this.userPlaylist.update((playlists) => {
      const playlistIndex: number = playlists.findIndex((playlist) => playlist.id === id);

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
  }

  private doesPlaylistExistsByName(name: string): boolean {
    return this.userPlaylist().some((playlist) => playlist.name === name);
  }
  private nowIso(): string {
    return new Date().toISOString();
  }

  private findPlaylistByName(name: string): OfflinePlaylist | undefined {
    return this.userPlaylist().find((entry) => entry.name === name);
  }
}
