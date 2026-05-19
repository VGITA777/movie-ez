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
  PlaylistTrackIdentityInput,
  PlaylistTrackInfoInput,
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
    const createdOn = this.nowIso();

    return this.createOnlinePlaylist({
      name,
      playlistId: id,
      createdOn,
      tracks: items.map((item) => this.toTrackInfoInput(item, createdOn)),
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
    return this.addTrackToOnlinePlaylist({
      playlistId,
      trackId,
      mediaType,
      addedOn: this.nowIso(),
    }).pipe(map((response) => response.details ?? null));
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
    return this.updateOnlinePlaylist(playlistId, {
      ...input,
      newTracks: input.newTracks?.map((track) => this.toTrackInfoInput(track)) ?? null,
      tracksToAdd: input.tracksToAdd?.map((track) => this.toTrackInfoInput(track)) ?? null,
      tracksToRemove:
        input.tracksToRemove?.map((track) => this.toTrackIdentityInput(track)) ?? null,
    }).pipe(map((response) => response.details ?? null));
  }

  public deleteAllTracksFromPlaylist(
    playlistId: string,
    items: OfflinePlaylistContent[],
  ): Observable<PlaylistDto | null> {
    return this.deleteAllTracksFromOnlinePlaylist({
      playlistId,
      tracks: items.map((item) => this.toTrackIdentityInput(item)),
    }).pipe(map((response) => response.details ?? null));
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

  /**
   * Backend create endpoint now expects:
   * {
   *   playlistId,
   *   name,
   *   createdOn,
   *   tracks: [{ trackId, mediaType, addedOn }]
   * }
   */
  public createOnlinePlaylist(
    input: CreateUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    return this.client.post<ServerResponse<PlaylistDto>>(this.baseUrl, {
      playlistId: input.playlistId ?? crypto.randomUUID(),
      name: input.name,
      createdOn: input.createdOn,
      tracks: input.tracks?.map((track) => this.toBackendTrackInfo(track)) ?? [],
    });
  }

  public createPlaylists(input: CreatePlaylistsInput): Observable<PlaylistDto[]> {
    return this.createOnlinePlaylists({
      playlists: input.playlists.map((playlist) => ({
        ...playlist,
        tracks: playlist.tracks.map((track) => this.toTrackInfoInput(track)),
      })),
    }).pipe(map((response) => response.details ?? []));
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

    return this.client.post<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedId}/update`, {
      newName: input.newName ?? null,
      newTracks: input.newTracks?.map((track) => this.toBackendTrackInfo(track)) ?? null,
      tracksToRemove:
        input.tracksToRemove?.map((track) => this.toBackendTrackIdentity(track)) ?? null,
      tracksToAdd: input.tracksToAdd?.map((track) => this.toBackendTrackInfo(track)) ?? null,
    });
  }

  /**
   * Backend add-one endpoint:
   * POST /users/playlists/{id}/tracks
   *
   * Body:
   * {
   *   trackId,
   *   mediaType,
   *   addedOn
   * }
   */
  public addTrackToOnlinePlaylist(
    input: AddTrackToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/tracks`,
      this.toBackendTrackInfo(input),
    );
  }

  /**
   * Backend add-many endpoint:
   * POST /users/playlists/{id}/tracks/batch
   */
  public addAllTracksToOnlinePlaylist(
    input: AddTracksToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/tracks/batch`,
      {
        tracks: input.tracks.map((track) => this.toBackendTrackInfo(track)),
      },
    );
  }

  /**
   * Backend delete-many endpoint:
   * DELETE /users/playlists/{id}/tracks/batch
   *
   * Deletion only needs trackId + mediaType.
   */
  public deleteAllTracksFromOnlinePlaylist(
    input: DeleteAllTracksFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedId}/tracks/batch`,
      {
        body: {
          tracks: input.tracks.map((track) => this.toBackendTrackIdentity(track)),
        },
      },
    );
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

  /**
   * Backend delete-one endpoint:
   * DELETE /users/playlists/{id}/tracks
   *
   * Body:
   * {
   *   trackId,
   *   mediaType
   * }
   */
  public deleteTrackFromPlaylist(
    input: DeleteTrackFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedId = encodeURIComponent(input.playlistId);

    return this.client.delete<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedId}/tracks`, {
      body: this.toBackendTrackIdentity(input),
    });
  }

  public createOnlinePlaylists(
    input: CreatePlaylistsInput,
  ): Observable<ServerResponse<PlaylistDto[]>> {
    return this.client.post<ServerResponse<PlaylistDto[]>>(`${this.baseUrl}create/batch`, {
      playlists: input.playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        createdOn: playlist.createdOn,
        tracks: playlist.tracks.map((track) => this.toBackendTrackInfo(track)),
      })),
    });
  }

  private toTrackInfoInput(
    input: Partial<OfflinePlaylistContent>,
    fallbackAddedOn: string = this.nowIso(),
  ): PlaylistTrackInfoInput {
    return {
      trackId: input.trackId?.trim() ?? '',
      mediaType: input.mediaType as MediaType,
      addedOn: input.addedOn ?? fallbackAddedOn,
    };
  }

  private toTrackIdentityInput(input: Partial<OfflinePlaylistContent>): PlaylistTrackIdentityInput {
    return {
      trackId: input.trackId?.trim() ?? '',
      mediaType: input.mediaType as MediaType,
    };
  }

  /**
   * Java enums are commonly serialized as "MOVIE", "TV", "PERSON".
   * The frontend can still use lowercase TMDB-style values locally.
   */
  private toBackendMediaType(mediaType: MediaType): string {
    return String(mediaType).trim().toUpperCase();
  }

  private toBackendTrackInfo(input: PlaylistTrackInfoInput): {
    trackId: string;
    mediaType: string;
    addedOn: string;
  } {
    return {
      trackId: input.trackId.trim(),
      mediaType: this.toBackendMediaType(input.mediaType),
      addedOn: input.addedOn,
    };
  }

  private toBackendTrackIdentity(input: PlaylistTrackIdentityInput): {
    trackId: string;
    mediaType: string;
  } {
    return {
      trackId: input.trackId.trim(),
      mediaType: this.toBackendMediaType(input.mediaType),
    };
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

  private nowIso(): string {
    return new Date().toISOString();
  }
}

interface OptionalPlaylistDto {
  value?: PlaylistDto | null;
  present?: boolean;
  empty?: boolean;
}
