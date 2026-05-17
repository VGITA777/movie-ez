import { Component, inject, Signal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { OfflinePlaylist } from '@shared/models';
import { PlaylistsEntryMe } from '@playlists/features/playlists-entry/playlists-entry.me';

@Component({
  selector: 'me-playlists',
  imports: [PlaylistsEntryMe],
  templateUrl: './playlists.me.html',
  styleUrl: './playlists.me.css',
})
export class PlaylistsMe {
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);

  protected readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylistService.playlists;
}
