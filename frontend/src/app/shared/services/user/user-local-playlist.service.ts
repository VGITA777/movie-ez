import { computed, Injectable, Signal, WritableSignal } from '@angular/core';
import {
  MEDIA_TYPES,
  MediaType,
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
import { MAX_PLAYLIST_NAME_LENGTH, USER_LOCAL_STORAGE_PLAYLIST_KEY } from '@shared/constants';

export interface PlaylistService {
  createPlaylist(
    playlistId: string,
    name: string,
    items?: OfflinePlaylistContent[],
  ): Observable<Playlist>;

  deletePlaylist(playlistId: string): Observable<void>;

  getPlaylist(playlistId: string): Observable<Playlist | null>;

  removeFromPlaylist(
    playlistId: string,
    trackId: string,
    mediaType: MediaType,
  ): Observable<Playlist | null>;

  addToPlaylist(
    playlistId: string,
    trackId: string,
    mediaType: MediaType,
  ): Observable<Playlist | null>;

  renamePlaylist(playlistId: string, newName: string): Observable<Playlist | null>;
}

class LocalUserPlaylistsSerializer implements Serializer<OfflinePlaylist[]> {
  private readonly defaultMediaType: MediaType = MediaType.MOVIE;

  write: (value: OfflinePlaylist[]) => string = (value) => JSON.stringify(value);

  read: (raw: string) => OfflinePlaylist[] = (raw): OfflinePlaylist[] => {
    try {
      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((playlist) => this.isValidPlaylist(playlist))
        .map((playlist: any) => {
          const createdOn = this.normalizeTimestamp(playlist.createdOn);
          const lastEditTimestamp = this.normalizeTimestamp(playlist.lastEditTimestamp);

          return {
            id: playlist.id ?? crypto.randomUUID(),
            name: playlist.name.trim(),
            createdOn,
            lastEditTimestamp,
            deletedOn: this.normalizeOptionalTimestamp(playlist.deletedOn),
            items: this.toUniqueContents(
              playlist.items
                .filter((content: unknown) => this.isValidContent(content))
                .map((content: any) => ({
                  trackId: content.trackId.trim(),
                  mediaType: this.normalizeMediaType(content.mediaType),
                  addedOn: this.normalizeTimestamp(content.addedOn),
                })),
            ),
          };
        });
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
    return (
      !!playlist &&
      typeof playlist.name === 'string' &&
      playlist.name.trim() !== '' &&
      Array.isArray(playlist.items)
    );
  }

  private isValidContent(content: any): content is OfflinePlaylistContent {
    return !!content && typeof content.trackId === 'string' && content.trackId.trim() !== '';
  }

  private normalizeMediaType(value: unknown): MediaType {
    if (typeof value !== 'string') {
      return this.defaultMediaType;
    }

    const normalized = value.trim().toLowerCase();

    return MEDIA_TYPES.includes(normalized as MediaType)
      ? (normalized as MediaType)
      : this.defaultMediaType;
  }

  private toUniqueContents(contents: OfflinePlaylistContent[]): OfflinePlaylistContent[] {
    const byKey: Map<string, OfflinePlaylistContent> = new Map();

    for (const content of contents) {
      const normalized: OfflinePlaylistContent = {
        trackId: content.trackId.trim(),
        mediaType: this.normalizeMediaType(content.mediaType),
        addedOn: this.normalizeTimestamp(content.addedOn),
      };

      const key = this.contentKey(normalized);
      const existing = byKey.get(key);

      /**
       * If duplicates exist, keep the earliest addedOn.
       */
      if (!existing || this.isBefore(normalized.addedOn, existing.addedOn)) {
        byKey.set(key, normalized);
      }
    }

    return [...byKey.values()];
  }

  private contentKey(content: OfflinePlaylistContent): string {
    return `${content.mediaType}:${content.trackId}`;
  }

  private isBefore(left: string, right: string): boolean {
    return new Date(left).getTime() < new Date(right).getTime();
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserLocalPlaylistService implements PlaylistService {
  private readonly defaultMediaType: MediaType = MediaType.MOVIE;

  private readonly userPlaylist: WritableSignal<OfflinePlaylist[]> = storage(
    USER_LOCAL_STORAGE_PLAYLIST_KEY,
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
          items: this.toUniqueContents(playlist.items),
        };

        const existing = mergedById.get(canonicalId);

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
    const newNameTrimmed = newName.trim();
    const currentPlaylist = this.findPlaylistById(id);

    if (currentPlaylist && currentPlaylist.name === newNameTrimmed) {
      return of(currentPlaylist);
    }

    if (newNameTrimmed === '' || newNameTrimmed.length > MAX_PLAYLIST_NAME_LENGTH) {
      return of(null);
    }

    if (this.doesPlaylistExistsByName(newNameTrimmed, id)) {
      return of(null);
    }

    if (!currentPlaylist || currentPlaylist.deletedOn) {
      return of(null);
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      name: newNameTrimmed,
      lastEditTimestamp: this.nowIso(),
    };

    this.updateExistingPlaylistById(id, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public createPlaylist(
    id: string,
    name: string,
    items: OfflinePlaylistContent[] = [],
  ): Observable<OfflinePlaylist> {
    const nameTrimmed: string = name.trim();

    if (nameTrimmed === '' || nameTrimmed.length > MAX_PLAYLIST_NAME_LENGTH) {
      throw new Error('Playlist name must be between 1 and 25 characters long.');
    }

    const now: string = this.nowIso();

    const newPlaylist: OfflinePlaylist = {
      id,
      name: nameTrimmed,
      items: this.toUniqueContents(
        items.map((item) => ({
          ...item,
          addedOn: item.addedOn ?? now,
        })),
      ),
      createdOn: now,
      lastEditTimestamp: now,
    };

    this.userPlaylist.update((playlists) => [...playlists, newPlaylist]);
    return of(newPlaylist);
  }

  public createIfNotExists(id: string, name: string): Observable<OfflinePlaylist> {
    const existing = this.findActivePlaylistByName(name);

    if (existing) {
      return of(existing);
    }

    return this.createPlaylist(id, name);
  }

  public createBlankPlaylist(): Observable<OfflinePlaylist> {
    return this.createPlaylist(crypto.randomUUID(), 'New Playlist');
  }

  public deletePlaylist(id: string): Observable<void> {
    const deletedOn = this.nowIso();

    this.userPlaylist.update((playlists) => {
      const index = playlists.findIndex((playlist) => playlist.id === id);

      if (index === -1) {
        return playlists;
      }

      const updated = [...playlists];

      updated[index] = {
        ...updated[index],
        deletedOn,
        lastEditTimestamp: deletedOn,
      };

      return updated;
    });

    return of();
  }

  public getPlaylist(id: string): Observable<OfflinePlaylist | null> {
    return of(this.findPlaylistById(id));
  }

  public getPlaylistNotObservable(id: string): OfflinePlaylist | null {
    return this.findPlaylistById(id);
  }

  public removeFromPlaylist(
    id: string,
    trackId: string,
    mediaType: MediaType,
  ): Observable<OfflinePlaylist | null> {
    const currentPlaylist = this.findPlaylistById(id);
    const contentToRemove = this.normalizeContent({ trackId, mediaType });

    if (!currentPlaylist || currentPlaylist.deletedOn || !contentToRemove) {
      return of(null);
    }

    const removeKey = this.contentKey(contentToRemove);

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: currentPlaylist.items.filter((content) => this.contentKey(content) !== removeKey),
      lastEditTimestamp: this.nowIso(),
    };

    this.updateExistingPlaylistById(id, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public addToPlaylist(
    id: string,
    trackId: string,
    mediaType: MediaType,
  ): Observable<OfflinePlaylist | null> {
    const currentPlaylist = this.findPlaylistById(id);
    const now = this.nowIso();
    const contentToAdd = this.normalizeContent({ trackId, mediaType, addedOn: now });

    if (!currentPlaylist || currentPlaylist.deletedOn || !contentToAdd) {
      return of(null);
    }

    const addKey = this.contentKey(contentToAdd);

    if (currentPlaylist.items.some((content) => this.contentKey(content) === addKey)) {
      return of(currentPlaylist);
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      items: this.toUniqueContents([...currentPlaylist.items, contentToAdd]),
      lastEditTimestamp: now,
    };

    this.updateExistingPlaylistById(id, updatedPlaylist);
    return of(updatedPlaylist);
  }

  public deletePermanently(id: string): void {
    this.userPlaylist.update((playlists) => playlists.filter((playlist) => playlist.id !== id));
  }

  public setPlaylistDeleteFlag(id: string, deletedOn: string): void {
    const currentPlaylist = this.findPlaylistById(id);

    if (!currentPlaylist) {
      return;
    }

    const updatedPlaylist: OfflinePlaylist = {
      ...currentPlaylist,
      deletedOn,
      lastEditTimestamp: deletedOn,
    };

    this.updateExistingPlaylistById(id, updatedPlaylist);
  }

  public deleteAllPlaylists(): void {
    const deletedOn = this.nowIso();

    this.userPlaylist.update((playlists) => {
      return playlists.map((playlist) => ({
        ...playlist,
        deletedOn,
        lastEditTimestamp: deletedOn,
      }));
    });
  }

  private findPlaylistById(id: string): OfflinePlaylist | null {
    return this.userPlaylist().find((entry) => entry.id === id) ?? null;
  }

  private updateExistingPlaylistById(id: string, newPlaylist: OfflinePlaylist): void {
    this.userPlaylist.update((playlists) => {
      const playlistIndex = playlists.findIndex((playlist) => playlist.id === id);

      if (playlistIndex === -1) {
        return playlists;
      }

      const updated = [...playlists];

      updated[playlistIndex] = {
        ...newPlaylist,
        createdOn: this.normalizeTimestamp(newPlaylist.createdOn),
        lastEditTimestamp: this.normalizeTimestamp(newPlaylist.lastEditTimestamp),
        items: this.toUniqueContents(newPlaylist.items),
      };

      return updated;
    });
  }

  private toOfflinePlaylist(playlist: PlaylistDto): OfflinePlaylist {
    return {
      id: playlist.id,
      name: playlist.name.trim(),
      createdOn: this.normalizeTimestamp(playlist.createdOn),
      lastEditTimestamp: this.normalizeTimestamp(playlist.lastEditTimestamp),
      deletedOn: this.normalizeOptionalTimestamp(playlist.deletedOn),
      items: this.toUniqueContents(playlist.items ?? []),
    };
  }

  private toUniqueContents(contents: OfflinePlaylistContent[]): OfflinePlaylistContent[] {
    const byKey: Map<string, OfflinePlaylistContent> = new Map();

    for (const content of contents) {
      const normalized = this.normalizeContent(content);

      if (!normalized) {
        continue;
      }

      const key = this.contentKey(normalized);
      const existing = byKey.get(key);

      /**
       * If duplicates exist, keep the earliest addedOn.
       */
      if (!existing || this.isBefore(normalized.addedOn, existing.addedOn)) {
        byKey.set(key, normalized);
      }
    }

    return [...byKey.values()];
  }

  private normalizeContent(
    content: Partial<OfflinePlaylistContent>,
  ): OfflinePlaylistContent | null {
    const trackId = content.trackId?.trim();

    if (!trackId) {
      return null;
    }

    return {
      trackId,
      mediaType: this.normalizeMediaType(content.mediaType),
      addedOn: this.normalizeTimestamp(content.addedOn),
    };
  }

  private normalizeMediaType(value: unknown): MediaType {
    if (typeof value !== 'string') {
      return this.defaultMediaType;
    }

    const normalized = value.trim().toLowerCase();

    return MEDIA_TYPES.includes(normalized as MediaType)
      ? (normalized as MediaType)
      : this.defaultMediaType;
  }

  private contentKey(content: OfflinePlaylistContent): string {
    return `${content.mediaType}:${content.trackId}`;
  }

  private mergeLocalDuplicates(first: OfflinePlaylist, second: OfflinePlaylist): OfflinePlaylist {
    const newest =
      new Date(second.lastEditTimestamp).getTime() > new Date(first.lastEditTimestamp).getTime()
        ? second
        : first;

    return {
      ...newest,
      createdOn: this.oldestTimestamp(first.createdOn, second.createdOn),
      deletedOn: this.newestOptionalTimestamp(first.deletedOn, second.deletedOn),
      items: this.toUniqueContents([...first.items, ...second.items]),
      lastEditTimestamp: this.newestTimestamp(first.lastEditTimestamp, second.lastEditTimestamp),
    };
  }

  private doesPlaylistExistsByName(name: string, ignoredId?: string): boolean {
    const normalizedName = this.normalizeName(name);

    return this.userPlaylist().some((playlist) => {
      return (
        !playlist.deletedOn &&
        playlist.id !== ignoredId &&
        this.normalizeName(playlist.name) === normalizedName
      );
    });
  }

  private findActivePlaylistByName(name: string): OfflinePlaylist | undefined {
    const normalizedName = this.normalizeName(name);

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

  private oldestTimestamp(left?: string, right?: string): string {
    if (!left) {
      return right ?? this.nowIso();
    }

    if (!right) {
      return left;
    }

    return new Date(left).getTime() <= new Date(right).getTime() ? left : right;
  }

  private isBefore(left: string, right: string): boolean {
    return new Date(left).getTime() < new Date(right).getTime();
  }

  private nowIso(): string {
    return new Date().toISOString();
  }
}
