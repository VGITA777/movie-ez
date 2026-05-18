import { Component, inject, Signal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist } from '@shared/models';
import { PlaylistsEntryMe } from '@playlists/features/playlists-entry/playlists-entry.me';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideCirclePlus } from '@ng-icons/lucide';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'me-playlists',
  imports: [PlaylistsEntryMe, HlmSeparatorImports, HlmIconImports, NgTemplateOutlet],
  templateUrl: './playlists.me.html',
  styleUrl: './playlists.me.css',
  providers: [provideIcons({ lucideCirclePlus })],
})
export class PlaylistsMe {
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);

  protected readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylistService.playlists;

  protected createNewPlaylist() {
    this.userLocalPlaylistService.createBlankPlaylist().subscribe();
  }
}
