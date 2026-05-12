import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist } from '@shared/models';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCloudSync,
  lucideMinus,
  lucideMoreVertical,
  lucidePlus,
  lucideRefreshCw,
} from '@ng-icons/lucide';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { ShowPlaylistsDirectiveContext } from '@shared/directives/show-playlists-directive';
import { toast, ToastT } from '@spartan-ng/brain/sonner';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { AutofocusDirective } from '@shared/directives/autofocus-directive';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { UserPlaylistManagerService } from '@shared/services/user/user-playlist-manager.service';
import { LocalWinsStrategy, PlaylistSyncStrategy } from '@shared/playlist-sync-strategy';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { UserPlaylistSyncService } from '@shared/services/user/user-playlist-sync.service';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'me-playlist-dialog',
  imports: [
    HlmItemImports,
    HlmButtonImports,
    NgScrollbar,
    HlmScrollAreaImports,
    HlmSeparatorImports,
    HlmDialogImports,
    HlmDropdownMenuImports,
    HlmIconImports,
    HlmInputGroupImports,
    AutofocusDirective,
    HlmAlertDialogImports,
    HlmTooltipImports,
  ],
  templateUrl: './playlist-dialog.me.html',
  styleUrl: './playlist-dialog.me.css',
  providers: [
    provideIcons({
      lucidePlus,
      lucideMinus,
      lucideMoreVertical,
      lucideCheck,
      lucideRefreshCw,
      lucideCloudSync,
    }),
  ],
})
export class PlaylistDialogMe implements OnInit {
  private static readonly DEFAULT_PLAYLIST_NAME = 'Favorites';
  private static readonly SHARED_TOAST_OPTIONS: Omit<ToastT, 'id' | 'type' | 'title'> = {
    position: 'top-right',
  };
  private readonly playlistManagerService: UserPlaylistManagerService = inject(
    UserPlaylistManagerService,
  );
  private readonly localWinsSyncStrategy: PlaylistSyncStrategy = inject(LocalWinsStrategy);
  private readonly localPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly dialogRef: BrnDialogRef<PlaylistDialogMe> =
    inject<BrnDialogRef<PlaylistDialogMe>>(BrnDialogRef);
  private readonly dialogContext: ShowPlaylistsDirectiveContext =
    injectBrnDialogContext<ShowPlaylistsDirectiveContext>();
  private readonly authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private readonly playlistSyncService: UserPlaylistSyncService = inject(UserPlaylistSyncService);

  protected readonly localPlaylists: Signal<OfflinePlaylist[]> =
    this.localPlaylistService.playlists;
  protected readonly currentEditingPlaylistId: WritableSignal<string | undefined> =
    signal(undefined);
  protected readonly isSyncing: Signal<boolean> = this.playlistManagerService.isSyncing;
  protected readonly isAuthenticated: Signal<boolean> = this.authFacadeService.isAuthenticated;

  public ngOnInit(): void {
    this.localPlaylistService
      .createPlaylist(crypto.randomUUID(), PlaylistDialogMe.DEFAULT_PLAYLIST_NAME)
      .subscribe();
    console.debug(`Current dialog context:`, this.dialogContext);
  }

  protected handlePlaylistButtonClick(playlistId: string): void {
    if (this.isTrackInPlaylist(playlistId)) {
      this.removeFromPlaylist(playlistId);
    } else {
      this.addToPlaylist(playlistId);
    }
  }

  protected addToPlaylist(name: string): void {
    const trackId: string = this.dialogContext.trackId;
    if (trackId.trim() === '') {
      this.closeDialog();
      return;
    }

    if (this.isTrackInPlaylist(name)) {
      this.handleTrackAlreadyInPlaylist(name);
      return;
    }

    this.handleAddingToPlaylist(name);
  }

  protected removeFromPlaylist(playlistId: string): void {
    const trackId: string = this.dialogContext.trackId;

    if (trackId.trim() === '') {
      this.closeDialog();
      return;
    }

    if (!this.isTrackInPlaylist(playlistId)) {
      this.handleTrackIsNotInPlaylist(playlistId);
      return;
    }

    this.handleRemovingFromPlaylist(playlistId);
  }

  protected isTrackInPlaylist(playlistId: string): boolean {
    const playlist: OfflinePlaylist | undefined = this.localPlaylists().find(
      (pl) => pl.id === playlistId,
    );
    if (!playlist) {
      return false;
    }
    const trackId: string = this.dialogContext.trackId;
    return playlist.items?.some((item) => item.trackId === trackId) ?? false;
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected setCurrentUpdatingPlaylist(playlistId?: string, event?: Event): void {
    event?.stopPropagation();
    this.currentEditingPlaylistId.set(playlistId);
  }

  protected handleDeletePlaylist(name: string): void {
    this.localPlaylistService.deletePlaylist(name).subscribe();
  }

  protected handleSavePlaylistName(event: Event, name: string, playlistId: string): void {
    event.stopPropagation();
    const newName: string = name.trim();

    if (newName.length === 0) {
      console.debug(
        `Attempted to rename playlist to an empty name. Current editing playlist: "${this.currentEditingPlaylistId()}".`,
      );
      toast.error(`Playlist name cannot be empty.`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
      this.currentEditingPlaylistId.set(undefined);
      return;
    }

    const currentPlaylist: OfflinePlaylist | undefined = this.localPlaylists().find(
      (pl) => pl.id === playlistId,
    );
    const isNameTaken: boolean =
      this.localPlaylists().some((playlist) => playlist.name === newName) &&
      newName !== currentPlaylist?.name;
    if (isNameTaken) {
      console.debug(
        `Playlist with name "${newName}" already exists. Current editing playlist: "${this.currentEditingPlaylistId()}".`,
      );
      toast.error(
        `A playlist with the name "${newName}" already exists. Please choose a different name.`,
        PlaylistDialogMe.SHARED_TOAST_OPTIONS,
      );
      this.currentEditingPlaylistId.set(undefined);
      return;
    }

    this.localPlaylistService.renamePlaylist(playlistId, newName).subscribe();
    this.currentEditingPlaylistId.set(undefined);
  }

  protected createNewPlaylist() {
    const baseName = 'New Playlist';
    let newName = baseName;
    let counter = 1;

    while (this.localPlaylists().some((playlist) => playlist.name === newName)) {
      newName = `${baseName} (${counter})`;
      counter++;
    }

    this.localPlaylistService.createPlaylist(crypto.randomUUID(), newName).subscribe();
  }

  protected handleDeleteAllPlaylists(context: any) {
    context.close();
    this.localPlaylistService.deleteAllPlaylists();
  }

  private handleTrackAlreadyInPlaylist(playlistName: string): void {
    toast.error(
      `Track is already in the playlist "${playlistName}".`,
      PlaylistDialogMe.SHARED_TOAST_OPTIONS,
    );
    this.closeDialog();
  }

  private handleAddingToPlaylist(playlistId: string): void {
    const name: string =
      this.localPlaylists().find((pl) => pl.id === playlistId)?.name ?? 'Unknown Playlist';
    this.localPlaylistService
      .addToPlaylist(playlistId, this.dialogContext.trackId, this.dialogContext.mediaType)
      .subscribe();
    toast.success(`Track added to playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
  }

  private handleRemovingFromPlaylist(playlistId: string): void {
    const name: string =
      this.localPlaylists().find((pl) => pl.id === playlistId)?.name ?? 'Unknown Playlist';
    this.localPlaylistService
      .removeFromPlaylist(playlistId, this.dialogContext.trackId, this.dialogContext.mediaType)
      .subscribe();
    toast.success(`Track removed from playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
  }

  private handleTrackIsNotInPlaylist(playlistId: string): void {
    const name: string =
      this.localPlaylists().find((pl) => pl.id === playlistId)?.name ?? 'Unknown Playlist';
    toast.error(`Track is not in the playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
    this.closeDialog();
  }

  protected syncPlaylists(): void {
    this.playlistManagerService.sync({
      next: () => {
        toast.success(`Playlists synced successfully.`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
      },
      error: (e) => {
        toast.error(`Failed to sync playlists.`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
      },
    });
  }
}
