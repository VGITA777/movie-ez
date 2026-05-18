import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { UserPlaylistSyncService } from '@shared/services/user/user-playlist-sync.service';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist, PlaylistSyncResponse, ServerResponse } from '@shared/models';
import { finalize, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistManagerService {
  private readonly authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private readonly playlistSyncService: UserPlaylistSyncService = inject(UserPlaylistSyncService);
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);

  private readonly _isSyncing: WritableSignal<boolean> = signal(false);

  public readonly isSyncing: Signal<boolean> = this._isSyncing.asReadonly();

  public sync(callbacks?: {
    next?: () => void;
    error?: (e: unknown) => void;
    complete?: () => void;
  }): void {
    if (!this.authFacadeService.isAuthenticated() || this.isSyncing()) {
      return;
    }

    this._isSyncing.set(true);

    const localPlaylists: OfflinePlaylist[] = this.userLocalPlaylistService.allPlaylists();

    this.playlistSyncService
      .syncPlaylists({ playlists: localPlaylists })
      .pipe(
        first(),
        tap({
          next: (response: ServerResponse<PlaylistSyncResponse>) => {
            const syncResult: PlaylistSyncResponse | null | undefined = response.details;

            if (!syncResult) {
              return;
            }

            this.userLocalPlaylistService.applySyncResponse(syncResult);
          },
        }),
        finalize(() => this._isSyncing.set(false)),
      )
      .subscribe({
        next: () => {
          callbacks?.next?.();
        },
        error: (error: unknown) => {
          callbacks?.error?.(error);
          console.error('Playlist sync failed', error);
        },
        complete: () => {
          callbacks?.complete?.();
        },
      });
  }
}
