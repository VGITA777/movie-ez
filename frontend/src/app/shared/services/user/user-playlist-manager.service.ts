import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { PlaylistSyncJobs, PlaylistSyncStrategy } from '@shared/playlist-sync-strategy';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { UserPlaylistService } from '@shared/services/user/user-playlist.service';
import { OfflinePlaylist, PlaylistDto } from '@shared/models';
import { finalize, first, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { AuthFacadeService } from '@shared/services/auth-facade-service';

export type SyncStrategyType = 'local-wins' | 'remote-wins' | 'last-write-wins';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistManagerService {
  private readonly localPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly remotePlaylistService: UserPlaylistService = inject(UserPlaylistService);
  private readonly authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private readonly _isSyncing: WritableSignal<boolean> = signal(false);

  public readonly isSyncing: Signal<boolean> = this._isSyncing.asReadonly();

  public sync(strategy: PlaylistSyncStrategy): void {
    if (!this.authFacadeService.isAuthenticated() || this.isSyncing()) {
      return;
    }

    this._isSyncing.set(true);

    this.remotePlaylistService
      .getPlaylists()
      .pipe(
        first(),
        switchMap((response) => {
          const localPlaylists: OfflinePlaylist[] = this.localPlaylistService.allPlaylists();
          const remotePlaylists: PlaylistDto[] = response.details;
          const syncJobs: PlaylistSyncJobs = strategy.sync(localPlaylists, remotePlaylists);

          const jobs: Observable<unknown>[] = [
            ...(syncJobs.remote.create ?? []),
            ...(syncJobs.remote.update ?? []),
            ...(syncJobs.remote.delete ?? []),
            ...(syncJobs.local.create ?? []),
            ...(syncJobs.local.update ?? []),
            ...(syncJobs.local.delete ?? []),
          ];

          if (jobs.length === 0) {
            syncJobs.cleanup?.();
            return of(void 0);
          }

          return forkJoin(jobs).pipe(
            tap({
              next: () => {
                syncJobs.cleanup?.();
              },
            }),
          );
        }),
        finalize(() => this._isSyncing.set(false)),
      )
      .subscribe();
  }
}
