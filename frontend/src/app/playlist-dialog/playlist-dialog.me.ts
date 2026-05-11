import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist } from '@shared/models';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideMinus,
  lucideMoreVertical,
  lucidePlus,
  lucideRefreshCcw,
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
  ],
  templateUrl: './playlist-dialog.me.html',
  styleUrl: './playlist-dialog.me.css',
  providers: [
    provideIcons({ lucidePlus, lucideMinus, lucideMoreVertical, lucideCheck, lucideRefreshCcw }),
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
  private readonly dialogContext = injectBrnDialogContext<ShowPlaylistsDirectiveContext>();

  protected readonly localPlaylists: Signal<OfflinePlaylist[]> =
    this.localPlaylistService.playlists;
  protected readonly currentEditingPlaylist: WritableSignal<string | undefined> = signal(undefined);

  public ngOnInit(): void {
    this.localPlaylistService.createPlaylist(PlaylistDialogMe.DEFAULT_PLAYLIST_NAME).subscribe();
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

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected setCurrentUpdatingPlaylist(name?: string, event?: Event): void {
    event?.stopPropagation();
    this.currentEditingPlaylist.set(name);
  }

  protected handleDeletePlaylist(name: string): void {
    this.localPlaylistService.deletePlaylist(name).subscribe();
  }

  protected handleSavePlaylistName(event: Event, name: string): void {
    event.stopPropagation();
    const newName: string = name.trim();

    if (newName.length === 0) {
      console.debug(
        `Attempted to rename playlist to an empty name. Current editing playlist: "${this.currentEditingPlaylist()}".`,
      );
      toast.error(`Playlist name cannot be empty.`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
      this.currentEditingPlaylist.set(undefined);
      return;
    }

    const isNameTaken: boolean =
      this.localPlaylists().some((playlist) => playlist.name === newName) &&
      newName !== this.currentEditingPlaylist();
    if (isNameTaken) {
      console.debug(
        `Playlist with name "${newName}" already exists. Current editing playlist: "${this.currentEditingPlaylist()}".`,
      );
      toast.error(
        `A playlist with the name "${newName}" already exists. Please choose a different name.`,
        PlaylistDialogMe.SHARED_TOAST_OPTIONS,
      );
      this.currentEditingPlaylist.set(undefined);
      return;
    }

    this.localPlaylistService.renamePlaylist(this.currentEditingPlaylist()!, newName).subscribe();
    this.currentEditingPlaylist.set(undefined);
  }

  protected createNewPlaylist() {
    const baseName = 'New Playlist';
    let newName = baseName;
    let counter = 1;

    while (this.localPlaylists().some((playlist) => playlist.name === newName)) {
      newName = `${baseName} (${counter})`;
      counter++;
    }

    this.localPlaylistService.createPlaylist(newName).subscribe();
  }

  protected handleDeleteAllPlaylists(context: any) {
    context.close();
    this.localPlaylistService.deleteAllPlaylists();
  }

  private handleTrackAlreadyInPlaylist(name: string): void {
    toast.error(
      `Track is already in the playlist "${name}".`,
      PlaylistDialogMe.SHARED_TOAST_OPTIONS,
    );
    this.closeDialog();
  }

  private handleAddingToPlaylist(name: string): void {
    this.localPlaylistService.addToPlaylist(name, this.dialogContext.trackId).subscribe();
    toast.success(`Track added to playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
  }

  private handleRemovingFromPlaylist(name: string): void {
    this.localPlaylistService.removeFromPlaylist(name, this.dialogContext.trackId).subscribe();
    toast.success(`Track removed from playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
  }

  private handleTrackIsNotInPlaylist(name: string): void {
    toast.error(`Track is not in the playlist "${name}".`, PlaylistDialogMe.SHARED_TOAST_OPTIONS);
    this.closeDialog();
  }

  protected syncPlaylists(): void {
    this.playlistManagerService.sync(this.localWinsSyncStrategy);
  }
}
