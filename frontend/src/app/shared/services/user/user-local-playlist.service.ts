import { computed, Injectable, Signal, WritableSignal } from '@angular/core';
import {
  OfflinePlaylist,
  OfflinePlaylistContent,
  Playlist,
  PlaylistDto,
  PlaylistIdMapping,
  PlaylistSyncResponse,
} from '@shared/models';
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
          id: playlist.id ?? crypto.randomUUID(),
          name: playlist.name.trim(),
          lastEditTimestamp: this.normalizeTimestamp(playlist.lastEditTimestamp),
          deletedOn: this.normalizeOptionalTimestamp(playlist.deletedOn),
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

  private normalizeTimestamp(value: unknown): string {
    return typeof value === 'string' && value.trim() !== '' ? value : new Date().toISOString();
  }

  private normalizeOptionalTimestamp(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
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

  public applySyncResponse(response: PlaylistSyncResponse): void {
    this.applyIdMappings(response.idMappings ?? []);
    this.replaceWithSyncedPlaylists(response.playlists ?? []);
  }

  public applyIdMappings(mappings: PlaylistIdMapping[]): void {
    if (!mappings.length) {
      return;
    }

    const mappingByLocalId: Map<string, string> = new Map(
      mappings
        .filter((mapping) => mapping.localId && mapping.canonicalServerId)
        .map((mapping) => [mapping.localId, mapping.canonicalServerId]),
    );

    if (mappingByLocalId.size === 0) {
      return;
    }

    this.userPlaylist.update((playlists) => {
      const mergedById: Map<string, OfflinePlaylist> = new Map();

      for (const playlist of playlists) {
        const canonicalId: string = mappingByLocalId.get(playlist.id) ?? playlist.id;
        const remappedPlaylist: OfflinePlaylist = {
          ...playlist,
          id: canonicalId,
        };

        const existing: OfflinePlaylist | undefined = mergedById.get(canonicalId);

        if (!existing) {
          mergedById.set(canonicalId, remappedPlaylist);
          continue;
        }

        mergedById.set(canonicalId, this.mergeLocalDuplicates(existing, remappedPlaylist));
      }

      return [...mergedById.values()];
    });
  }

  public replaceWithSyncedPlaylists(playlists: PlaylistDto[]): void {
    const syncedPlaylists: OfflinePlaylist[] = playlists
      .filter((playlist) => !!playlist)
      .map((playlist) => this.toOfflinePlaylist(playlist));

    this.userPlaylist.set(syncedPlaylists);
  }

  public renamePlaylist(id: string, newName: string): Observable<Playlist | null> {
    const newNameTrimmed: string = newName.trim();
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

    if (this.doesPlaylistExistsByName(newNameTrimmed, id)) {
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
    const nameTrimmed: string = name.trim();
    const existing: OfflinePlaylist | undefined = this.findActivePlaylistByName(nameTrimmed);

    if (existing) {
      return of(existing);
    }

    const newPlaylist: OfflinePlaylist = {
      id,
      name: nameTrimmed,
      items: this.toUniqueContents(items ?? []),
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
        lastEditTimestamp: this.nowIso(),
      };

      return updated;
    });

    return of();
  }

  public getPlaylist(id: string): Observable<OfflinePlaylist | null> {
    return of(this.findPlaylistById(id));
  }

  public removeFromPlaylist(id: string, trackId: string): Observable<OfflinePlaylist | null> {
    const currentPlaylist: OfflinePlaylist | null = this.findPlaylistById(id);

    if (!currentPlaylist || currentPlaylist.deletedOn) {
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
    const normalizedTrackId: string = trackId.trim();

    if (!currentPlaylist || currentPlaylist.deletedOn || normalizedTrackId === '') {
      return of(null);
    }

    if (currentPlaylist.items.some((content) => content.trackId === normalizedTrackId)) {
      return of(currentPlaylist);
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: [...currentPlaylist.items, { trackId: normalizedTrackId }],
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
      deletedOn,
      lastEditTimestamp: this.nowIso(),
    };

    this.updateExistingPlaylistById(id, updatedPlaylist);
  }

  public deleteAllPlaylists(): void {
    const deletedOn: string = this.nowIso();

    this.userPlaylist.update((playlists) => {
      return playlists.map((playlist) => ({
        ...playlist,
        deletedOn,
        lastEditTimestamp: deletedOn,
      }));
    });
  }

  private findPlaylistById(id: string): OfflinePlaylist | null {
    const playlist: OfflinePlaylist | undefined = this.userPlaylist().find(
      (entry) => entry.id === id,
    );

    return playlist ?? null;
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
        lastEditTimestamp: newPlaylist.lastEditTimestamp ?? this.nowIso(),
        items: this.toUniqueContents(newPlaylist.items.map((item) => item.trackId)),
      };

      return updated;
    });
  }

  private toOfflinePlaylist(playlist: PlaylistDto): OfflinePlaylist {
    return {
      id: playlist.id,
      name: playlist.name.trim(),
      lastEditTimestamp: this.normalizeTimestamp(playlist.lastEditTimestamp),
      deletedOn: this.normalizeOptionalTimestamp(playlist.deletedOn),
      items: this.toUniqueContents(this.extractTrackIdsFromDto(playlist)),
    };
  }

  private extractTrackIdsFromDto(playlist: PlaylistDto): string[] {
    const items = playlist.items ?? [];

    return items
      .map((item) => item.trackId)
      .filter((trackId): trackId is string => typeof trackId === 'string' && trackId.trim() !== '');
  }

  private toUniqueContents(trackIds: string[]): OfflinePlaylistContent[] {
    const uniqueTrackIds: Set<string> = new Set(
      trackIds.map((trackId) => trackId.trim()).filter((trackId) => trackId !== ''),
    );

    return [...uniqueTrackIds].map((trackId) => ({ trackId }));
  }

  private mergeLocalDuplicates(first: OfflinePlaylist, second: OfflinePlaylist): OfflinePlaylist {
    const firstTimestamp: string = first.lastEditTimestamp ?? '';
    const secondTimestamp: string = second.lastEditTimestamp ?? '';

    const newest: OfflinePlaylist =
      new Date(secondTimestamp).getTime() > new Date(firstTimestamp).getTime() ? second : first;

    const deletedOn: string | undefined = this.newestOptionalTimestamp(
      first.deletedOn,
      second.deletedOn,
    );

    return {
      ...newest,
      deletedOn,
      items: this.toUniqueContents([
        ...first.items.map((item) => item.trackId),
        ...second.items.map((item) => item.trackId),
      ]),
      lastEditTimestamp: this.newestTimestamp(first.lastEditTimestamp, second.lastEditTimestamp),
    };
  }

  private doesPlaylistExistsByName(name: string, ignoredId?: string): boolean {
    const normalizedName: string = this.normalizeName(name);

    return this.userPlaylist().some((playlist) => {
      return (
        !playlist.deletedOn &&
        playlist.id !== ignoredId &&
        this.normalizeName(playlist.name) === normalizedName
      );
    });
  }

  private findActivePlaylistByName(name: string): OfflinePlaylist | undefined {
    const normalizedName: string = this.normalizeName(name);

    return this.userPlaylist().find((entry) => {
      return !entry.deletedOn && this.normalizeName(entry.name) === normalizedName;
    });
  }

  private normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }

  private normalizeTimestamp(value: unknown): string {
    return typeof value === 'string' && value.trim() !== '' ? value : this.nowIso();
  }

  private normalizeOptionalTimestamp(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
  }

  private newestTimestamp(left?: string, right?: string): string {
    if (!left) {
      return right ?? this.nowIso();
    }

    if (!right) {
      return left;
    }

    return new Date(left).getTime() >= new Date(right).getTime() ? left : right;
  }

  private newestOptionalTimestamp(left?: string | null, right?: string | null): string | undefined {
    if (!left) {
      return right ?? undefined;
    }

    if (!right) {
      return left;
    }

    return new Date(left).getTime() >= new Date(right).getTime() ? left : right;
  }

  private nowIso(): string {
    return new Date().toISOString();
  }
}
