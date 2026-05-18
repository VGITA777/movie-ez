import { Component, inject, Signal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist } from '@shared/models';
import { PlaylistsEntryMe } from '@playlists/features/playlists-entry/playlists-entry.me';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideCirclePlus, lucideCloudSync, lucideRefreshCw } from '@ng-icons/lucide';
import { NgTemplateOutlet } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { UserPlaylistManagerService } from '@shared/services/user/user-playlist-manager.service';
import { breakpoints } from '@signality/core';
import { DEFAULT_BREAKPOINTS } from '@shared/shared-types';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
  selector: 'me-playlists',
  imports: [
    PlaylistsEntryMe,
    HlmSeparatorImports,
    HlmIconImports,
    NgTemplateOutlet,
    HlmButtonImports,
    HlmSkeletonImports,
  ],
  templateUrl: './playlists.me.html',
  styleUrl: './playlists.me.css',
  providers: [provideIcons({ lucideCirclePlus, lucideRefreshCw, lucideCloudSync })],
})
export class PlaylistsMe {
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly userPlaylistManagerService: UserPlaylistManagerService = inject(
    UserPlaylistManagerService,
  );

  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);
  protected readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylistService.playlists;
  protected readonly isAuthenticated = this.authFacade.isAuthenticated;
  protected readonly isSyncing = this.userPlaylistManagerService.isSyncing;
  protected readonly playlistEntrySkeletonCount: number[] = Array(6).fill(0);

  protected createNewPlaylist() {
    this.userLocalPlaylistService.createBlankPlaylist().subscribe();
  }

  protected syncPlaylists(): void {
    this.userPlaylistManagerService.sync();
  }
}
