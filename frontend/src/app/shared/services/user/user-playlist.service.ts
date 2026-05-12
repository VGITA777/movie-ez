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
  MediaType,
  OfflinePlaylistContent,
  PlaylistContentDto,
  PlaylistDto,
  PlaylistUpdateInput,
  ServerResponse,
} from '@shared/models';
import { AbstractMediaBackendService } from '@shared/services/media/abstract-media-backend-service';
import { PlaylistService } from '@shared/services/user/user-local-playlist.service';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistService extends AbstractMediaBackendService implements PlaylistService {
  constructor() {
    super(`${environment.api.userBaseUrl}playlists/`);
  }

  public createPlaylist(
    id: string,
    name: string,
    items: OfflinePlaylistContent[] = [],
  ): Observable<PlaylistDto> {
    return this.createOnlinePlaylist({
      name,
      playlistId: id,
      items,
    }).pipe(map((response) => response.details));
  }

  public deletePlaylist(playlistId: string): Observable<void> {
    return this.deleteOnlinePlaylist({ playlistId }).pipe(map(() => undefined));
  }

  public getPlaylist(playlistId: string): Observable<PlaylistDto | null> {
    return this.getOnlinePlaylistById({ id: playlistId }).pipe(
      map((response) => this.unwrapOptional(response.details)),
    );
  }

  public removeFromPlaylist(
    playlistId: string,
    trackId: string,
    mediaType: MediaType,
  ): Observable<PlaylistDto | null> {
    return this.deleteTrackFromPlaylist({ playlistId, trackId, mediaType }).pipe(
      map((response) => response.details ?? null),
    );
  }

  public addToPlaylist(
    playlistId: string,
    trackId: string,
    mediaType: MediaType,
  ): Observable<PlaylistDto | null> {
    return this.addTrackToOnlinePlaylist({ playlistId, trackId, mediaType }).pipe(
      map((response) => response.details ?? null),
    );
  }

  public renamePlaylist(playlistId: string, newName: string): Observable<PlaylistDto | null> {
    return this.updatePlaylistName(playlistId, newName).pipe(
      map((response) => response.details ?? null),
    );
  }

  public updatePlaylist(
    playlistId: string,
    input: PlaylistUpdateInput,
  ): Observable<PlaylistDto | null> {
    return this.updateOnlinePlaylist(playlistId, input).pipe(
      map((response) => response.details ?? null),
    );
  }

  public deleteAllTracksFromPlaylist(
    playlistId: string,
    items: OfflinePlaylistContent[],
  ): Observable<PlaylistDto | null> {
    return this.deleteAllTracksFromOnlinePlaylist({ playlistId, items }).pipe(
      map((response) => response.details ?? null),
    );
  }

  public getPlaylists(): Observable<ServerResponse<PlaylistDto[]>> {
    return this.performRequest<ServerResponse<PlaylistDto[]>, undefined>('all');
  }

  public getOnlinePlaylistById(
    input: GetUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto | OptionalPlaylistDto | null>> {
    return this.performRequest<ServerResponse<PlaylistDto | OptionalPlaylistDto | null>, undefined>(
      encodeURIComponent(input.id),
    );
  }

  public getOnlinePlaylistContents(
    input: GetUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistContentDto[]>> {
    return this.performRequest<ServerResponse<PlaylistContentDto[]>, undefined>(
      `${encodeURIComponent(input.id)}/tracks`,
    );
  }

  public createOnlinePlaylist(
    input: CreateUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName = encodeURIComponent(input.name);

    return this.client.post<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedName}`, {
      playlistId: input.playlistId ?? crypto.randomUUID(),

      /**
       * Replaces the old trackIds-only payload.
       * Each item must include trackId + mediaType.
       */
      items: input.items ?? [],
    });
  }

  public createPlaylists(input: CreatePlaylistsInput): Observable<PlaylistDto[]> {
    return this.createOnlinePlaylists(input).pipe(map((response) => response.details ?? []));
  }

  public updatePlaylistName(
    playlistId: string,
    newName: string,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(playlistId);

    return this.client.patch<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedId}/name`, {
      name: newName,
    });
  }

  public updateOnlinePlaylist(
    playlistId: string,
    input: PlaylistUpdateInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(playlistId);

    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/update`,
      input,
    );
  }

  public addTrackToOnlinePlaylist(
    input: AddTrackToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);
    const encodedTrackId = encodeURIComponent(input.trackId);

    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/tracks/${encodedTrackId}`,

      /**
       * Backend should read mediaType from the request body.
       */
      {
        mediaType: input.mediaType,
      },
    );
  }

  public addAllTracksToOnlinePlaylist(
    input: AddTracksToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.post<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedId}/tracks`, {
      items: input.items,
    });
  }

  public deleteAllTracksFromOnlinePlaylist(
    input: DeleteAllTracksFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.delete<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedId}/tracks`, {
      body: {
        playlistId: input.playlistId,
        items: input.items,
      },
    });
  }

  public clearPlaylistTracks(playlistId: string): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(playlistId);

    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/tracks/all`,
    );
  }

  public deleteOnlinePlaylist(input: DeletePlaylistInput): Observable<ServerResponse<unknown>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.delete<ServerResponse<unknown>>(`${this.baseUrl}${encodedId}`);
  }

  public deleteTrackFromPlaylist(
    input: DeleteTrackFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);
    const encodedTrackId = encodeURIComponent(input.trackId);

    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/tracks/${encodedTrackId}`,
      {
        /**
         * Backend should use this mediaType together with trackId.
         */
        body: {
          mediaType: input.mediaType,
        },
      },
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
