import {
  CreatePlaylistsInput,
  OfflinePlaylist,
  PlaylistDto,
  PlaylistUpdateInput,
} from '@shared/models';
import { finalize, first, Observable, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { UserPlaylistService } from '@shared/services/user/user-playlist.service';

export interface PlaylistSyncJobs {
  local: {
    create?: Observable<unknown>[];
    update?: Observable<unknown>[];
    delete?: Observable<unknown>[];
  };
  remote: {
    create?: Observable<unknown>[];
    update?: Observable<unknown>[];
    delete?: Observable<unknown>[];
  };
  cleanup?: () => void;
}

export interface PlaylistSyncStrategy {
  sync(local: OfflinePlaylist[], remote: PlaylistDto[]): PlaylistSyncJobs;
}

@Injectable({ providedIn: 'root' })
export class LocalWinsStrategy implements PlaylistSyncStrategy {
  private readonly localPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly remotePlaylistService: UserPlaylistService = inject(UserPlaylistService);

  sync(local: OfflinePlaylist[], remote: PlaylistDto[]): PlaylistSyncJobs {
    console.debug(`Sync Process: Current Local Playlists`, local);
    console.debug(`Sync Process: Current Remote Playlists`, remote);

    const toBeCreatedAtRemote = local.filter((localPlaylist) => {
      // Create only if missing remotely and not marked for deletion.
      return (
        !localPlaylist.toBeDeleted &&
        !remote.some((remotePlaylist) => remotePlaylist.name === localPlaylist.name)
      );
    });

    console.debug(`Sync Process: Playlists to be created at remote`, toBeCreatedAtRemote);

    const toBeCreatedRequest: CreatePlaylistsInput = {
      playlists: toBeCreatedAtRemote.map((playlist) => ({
        name: playlist.name,
        trackIds: playlist.items.map((item) => item.trackId),
      })),
    };

    const toBeDeletedAtRemote = remote.filter((remotePlaylist) => {
      // Delete remote if missing locally or explicitly marked for deletion locally.
      return !local.some(
        (localPlaylist) => localPlaylist.name === remotePlaylist.name && !localPlaylist.toBeDeleted,
      );
    });

    console.debug(`Sync Process: Playlists to be deleted at remote`, toBeDeletedAtRemote);

    const toBeUpdatedAtRemote = local.filter((localPlaylist) => {
      // Update only if it exists remotely and is not marked for deletion.
      return (
        !localPlaylist.toBeDeleted &&
        remote.some((remotePlaylist) => remotePlaylist.name === localPlaylist.name)
      );
    });

    console.debug(`Sync Process: Playlists to be updated at remote`, toBeUpdatedAtRemote);

    return {
      remote: {
        create: [
          this.remotePlaylistService.createOnlinePlaylists(toBeCreatedRequest).pipe(first()),
        ],
        update: [
          ...toBeUpdatedAtRemote.map((playlist) => {
            const playlistUpdateInput: PlaylistUpdateInput = {
              newName: playlist.toBeRenamed ? playlist.name : null,
              newTracks: playlist.items.map((item) => item.trackId),
            };

            return this.remotePlaylistService
              .updateOnlinePlaylist(playlist.name, playlistUpdateInput)
              .pipe(
                first(),
                tap({
                  complete: () => {
                    this.localPlaylistService.setPlaylistRenameFlag(playlist.name, false);
                  },
                }),
              );
          }),
        ],
        delete: [
          ...toBeDeletedAtRemote.map((playlist) => {
            return this.remotePlaylistService.deletePlaylist(playlist.name).pipe(
              first(),
              finalize(() => {
                console.debug(
                  `Sync Process: Successfully deleted remote playlist ${playlist.name}, now deleting locally as well.`,
                );
                this.localPlaylistService.deletePermanently(playlist.name);
              }),
            );
          }),
        ],
      },
      local: {},
    };
  }
}

export class RemoteWinsStrategy implements PlaylistSyncStrategy {
  sync(local: OfflinePlaylist[], remote: PlaylistDto[]): PlaylistSyncJobs {
    return { remote: {}, local: {} };
  }
}

export class MostRecentWinsStrategy implements PlaylistSyncStrategy {
  sync(local: OfflinePlaylist[], remote: PlaylistDto[]): PlaylistSyncJobs {
    return { remote: {}, local: {} };
  }
}
