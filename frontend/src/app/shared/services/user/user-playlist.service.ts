import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  AddTracksToPlaylistInput,
  AddTrackToPlaylistInput,
  CreatePlaylistsInput,
  CreateUserPlaylistInput,
  DeleteAllTracksFromPlaylistInput,
  DeletePlaylistInput,
  DeleteTrackFromPlaylistInput,
  GetUserPlaylistInput,
  PlaylistContentDto,
  PlaylistDto,
  PlaylistUpdateInput,
  ServerResponse,
} from '@shared/models';
import { PlaylistService } from '@shared/services/user/user-local-playlist.service';
import { AbstractMediaBackendService } from '@shared/services/media/abstract-media-backend-service';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistService extends AbstractMediaBackendService implements PlaylistService {
  constructor() {
    super(`${environment.api.userBaseUrl}playlists/`);
  }

  public createPlaylist(name: string, items?: string[]): Observable<PlaylistDto> {
    return this.createOnlinePlaylist({
      name,
      trackIds: items ?? [],
    }).pipe(map((response) => response.details));
  }

  public deletePlaylist(name: string): Observable<void> {
    return this.deleteOnlinePlaylist({ name: name.trim() }).pipe(map(() => undefined));
  }

  public getPlaylist(playlistName: string): Observable<PlaylistDto | null> {
    return this.getOnlinePlaylistByName({ name: playlistName }).pipe(
      map((response) => this.unwrapOptional(response.details)),
    );
  }

  public removeFromPlaylist(playlistName: string, trackId: string): Observable<PlaylistDto | null> {
    return this.deleteTrackFromPlaylist({ name: playlistName, trackId }).pipe(
      map((response) => response.details ?? null),
    );
  }

  public addToPlaylist(playlistName: string, trackId: string): Observable<PlaylistDto | null> {
    return this.addTrackToOnlinePlaylist({ name: playlistName, trackId }).pipe(
      map((response) => response.details ?? null),
    );
  }

  public renamePlaylist(oldName: string, newName: string): Observable<PlaylistDto | null> {
    return this.updatePlaylistName(oldName, newName).pipe(
      map((response) => response.details ?? null),
    );
  }

  public updatePlaylist(name: string, input: PlaylistUpdateInput): Observable<PlaylistDto | null> {
    return this.updateOnlinePlaylist(name, input).pipe(map((response) => response.details ?? null));
  }

  public deleteAllTracksFromPlaylist(
    playlistName: string,
    trackIds: string[],
  ): Observable<PlaylistDto | null> {
    return this.deleteAllTracksFromOnlinePlaylist({ name: playlistName, trackIds }).pipe(
      map((response) => response.details ?? null),
    );
  }

  public getPlaylists(): Observable<ServerResponse<PlaylistDto[]>> {
    return this.performRequest<ServerResponse<PlaylistDto[]>, undefined>('all');
  }

  public getOnlinePlaylistByName(
    input: GetUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto | OptionalPlaylistDto | null>> {
    const encodedName: string = encodeURIComponent(input.name);
    return this.performRequest<ServerResponse<PlaylistDto | OptionalPlaylistDto | null>, undefined>(
      encodedName,
    );
  }

  public getOnlinePlaylistContents(
    input: GetUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistContentDto[]>> {
    const encodedName: string = encodeURIComponent(input.name);
    return this.performRequest<ServerResponse<PlaylistContentDto[]>, undefined>(
      `${encodedName}/tracks`,
    );
  }

  public createOnlinePlaylist(
    input: CreateUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName: string = encodeURIComponent(input.name);
    return this.client.post<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedName}`, {
      trackIds: input.trackIds ?? [],
    });
  }

  public createPlaylists(input: CreatePlaylistsInput): Observable<PlaylistDto[]> {
    return this.createOnlinePlaylists(input).pipe(map((response) => response.details ?? []));
  }

  public updatePlaylistName(name: string, newName: string) {
    const encodedName: string = encodeURIComponent(name);
    return this.client.patch<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedName}/name`, {
      name: newName,
    });
  }

  public updateOnlinePlaylist(
    name: string,
    input: PlaylistUpdateInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName: string = encodeURIComponent(name);
    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/update`,
      input,
    );
  }

  public addTrackToOnlinePlaylist(
    input: AddTrackToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName: string = encodeURIComponent(input.name);
    const encodedTrackId: string = encodeURIComponent(input.trackId);
    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/tracks/${encodedTrackId}`,
      null,
    );
  }

  public addAllTracksToOnlinePlaylist(
    input: AddTracksToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName: string = encodeURIComponent(input.name);
    return this.client.post<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedName}/tracks`, {
      trackIds: input.trackIds,
    });
  }

  public deleteAllTracksFromOnlinePlaylist(
    input: DeleteAllTracksFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedPlaylistName: string = encodeURIComponent(input.name);
    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedPlaylistName}/tracks`,
      {
        body: { trackIds: input.trackIds },
      },
    );
  }

  public clearPlaylistTracks(name: string): Observable<ServerResponse<PlaylistDto>> {
    const encodedName: string = encodeURIComponent(name);
    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/tracks/all`,
    );
  }

  public deleteOnlinePlaylist(input: DeletePlaylistInput): Observable<ServerResponse<unknown>> {
    const encodedName: string = encodeURIComponent(input.name);
    return this.client.delete<ServerResponse<unknown>>(`${this.baseUrl}${encodedName}`);
  }

  public deleteTrackFromPlaylist(
    input: DeleteTrackFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName: string = encodeURIComponent(input.name);
    const encodedTrackId: string = encodeURIComponent(input.trackId);
    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/tracks/${encodedTrackId}`,
    );
  }

  public createOnlinePlaylists(
    input: CreatePlaylistsInput,
  ): Observable<ServerResponse<PlaylistDto[]>> {
    return this.client.post<ServerResponse<PlaylistDto[]>>(`${this.baseUrl}create/batch`, input);
  }

  private unwrapOptional(details: PlaylistDto | OptionalPlaylistDto | null): PlaylistDto | null {
    if (!details) {
      return null;
    }

    if (
      typeof details === 'object' &&
      ('value' in details || 'present' in details || 'empty' in details)
    ) {
      const wrapped = details as OptionalPlaylistDto;
      return wrapped.value ?? null;
    }

    return details as PlaylistDto;
  }
}

interface OptionalPlaylistDto {
  value?: PlaylistDto | null;
  present?: boolean;
  empty?: boolean;
}
