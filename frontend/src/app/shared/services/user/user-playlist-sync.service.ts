import { inject, Injectable } from '@angular/core';
import { PlaylistSyncInput, PlaylistSyncResponse, ServerResponse } from '@shared/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistSyncService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.api.userBaseUrl;

  public syncPlaylists(input: PlaylistSyncInput): Observable<ServerResponse<PlaylistSyncResponse>> {
    return this.httpClient.post<ServerResponse<PlaylistSyncResponse>>(
      `${this.baseUrl}playlists/sync`,
      input,
    );
  }
}
