import { inject, Injectable } from '@angular/core';
import { PlaylistSyncJobs, PlaylistSyncStrategy } from '@shared/playlist-sync-strategy';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { UserPlaylistService } from '@shared/services/user/user-playlist.service';
import { OfflinePlaylist, PlaylistDto } from '@shared/models';
import { first, forkJoin, switchMap, tap } from 'rxjs';
import { AuthFacadeService } from '@shared/services/auth-facade-service';

export type SyncStrategyType = 'local-wins' | 'remote-wins' | 'last-write-wins';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistManagerService {
  private readonly localPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly remotePlaylistService: UserPlaylistService = inject(UserPlaylistService);
  private readonly authFacadeService = inject(AuthFacadeService);

  public sync(strategy: PlaylistSyncStrategy): void {
    if (!this.authFacadeService.isAuthenticated()) {
      return;
    }

    const requests = this.remotePlaylistService.getPlaylists().pipe(
      first(),
      switchMap((response) => {
        const localPlaylists: OfflinePlaylist[] = this.localPlaylistService.allPlaylists();
        const remotePlaylist: PlaylistDto[] = response.details;
        const syncJobs: PlaylistSyncJobs = strategy.sync(localPlaylists, remotePlaylist);

        const remoteCreateJobs = syncJobs.remote.create ?? [];
        const remoteUpdateJobs = syncJobs.remote.update ?? [];
        const remoteDeleteJobs = syncJobs.remote.delete ?? [];

        const localCreateJobs = syncJobs.local.create ?? [];
        const localUpdateJobs = syncJobs.local.update ?? [];
        const localDeleteJobs = syncJobs.local.delete ?? [];

        return forkJoin([
          ...remoteCreateJobs,
          ...remoteUpdateJobs,
          ...remoteDeleteJobs,
          ...localCreateJobs,
          ...localUpdateJobs,
          ...localDeleteJobs,
        ]).pipe(
          tap({
            complete: () => {
              syncJobs.cleanup?.();
            },
          }),
        );
      }),
    );

    requests.subscribe();
  }
}
