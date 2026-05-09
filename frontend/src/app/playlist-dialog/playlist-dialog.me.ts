import { Component, inject, OnInit, Signal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist } from '@shared/models';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { ShowPlaylistsDirectiveContext } from '@shared/directives/show-playlists-directive';
import { toast, ToastT } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'me-playlist-dialog',
  imports: [HlmItemImports, HlmButtonImports, HlmIconImports, NgScrollbar, HlmScrollAreaImports],
  templateUrl: './playlist-dialog.me.html',
  styleUrl: './playlist-dialog.me.css',
  providers: [provideIcons({ lucidePlus, lucideMinus })],
})
export class PlaylistDialogMe implements OnInit {
  private static readonly DEFAULT_PLAYLIST_NAME = 'Favorites';
  private static readonly SHARED_TOAST_OPTIONS: Omit<ToastT, 'id' | 'type' | 'title'> = {
    position: 'top-right',
  };
  private readonly localPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly dialogRef: BrnDialogRef<PlaylistDialogMe> =
    inject<BrnDialogRef<PlaylistDialogMe>>(BrnDialogRef);
  private readonly dialogContext = injectBrnDialogContext<ShowPlaylistsDirectiveContext>();

  protected readonly localPlaylists: Signal<OfflinePlaylist[]> =
    this.localPlaylistService.playlists;

  public ngOnInit(): void {
    this.localPlaylistService.createPlaylist(PlaylistDialogMe.DEFAULT_PLAYLIST_NAME);

    console.debug(`Current dialog context:`, this.dialogContext.trackId);
  }

  protected handlePlaylistButtonClick(name: string): void {
    if (this.isTrackInPlaylist(name)) {
      this.removeFromPlaylist(name);
    } else {
      this.addToPlaylist(name);
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

  protected removeFromPlaylist(name: string): void {
    const trackId: string = this.dialogContext.trackId;

    if (trackId.trim() === '') {
      this.closeDialog();
      return;
    }

    if (!this.isTrackInPlaylist(name)) {
      this.handleTrackIsNotInPlaylist(name);
      return;
    }

    this.handleRemovingFromPlaylist(name);
  }

  private handleTrackAlreadyInPlaylist(name: string): void {
    toast.error(
      `Track is already in the playlist "${name}".`,
      PlaylistDialogMe.SHARED_TOAST_OPTIONS,
    );
    this.closeDialog();
  }

  private handleAddingToPlaylist(name: string): void {
    this.localPlaylistService.addToPlaylist(name, this.dialogContext.trackId);
    toast.success(`Track added to playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
    this.closeDialog();
  }

  private handleRemovingFromPlaylist(name: string): void {
    this.localPlaylistService.removeFromPlaylist(name, this.dialogContext.trackId);
    toast.success(`Track removed from playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
    this.closeDialog();
  }

  private handleTrackIsNotInPlaylist(name: string): void {
    toast.error(`Track is not in the playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
    this.closeDialog();
  }

  protected isTrackInPlaylist(name: string): boolean {
    const playlist: OfflinePlaylist | undefined = this.localPlaylists().find(
      (pl) => pl.name === name,
    );
    if (!playlist) {
      return false;
    }
    const trackId: string = this.dialogContext.trackId;
    return playlist.items?.some((item) => item.trackId === trackId) ?? false;
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }
}
