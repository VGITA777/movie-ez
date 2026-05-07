import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  AddTracksToPlaylistInput,
  AddTrackToPlaylistInput,
  CreateUserPlaylistInput,
  DeletePlaylistInput,
  DeleteTrackFromPlaylistInput,
  GetUserPlaylistInput,
  PlaylistContentDto,
  PlaylistDto,
  ServerResponse,
} from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class UserPlaylistService {
  private readonly baseUrl = `${environment.api.baseUrl}users/playlists/`;

  constructor(private readonly client: HttpClient) {}

  public getPlaylists(): Observable<ServerResponse<PlaylistDto[]>> {
    return this.client.get<ServerResponse<PlaylistDto[]>>(`${this.baseUrl}all`);
  }

  public getPlaylistByName(
    input: GetUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto | null>> {
    const encodedName = encodeURIComponent(input.name);
    return this.client.get<ServerResponse<PlaylistDto | null>>(`${this.baseUrl}${encodedName}`);
  }

  public getPlaylistContents(
    input: GetUserPlaylistInput,
  ): Observable<ServerResponse<PlaylistContentDto[]>> {
    const encodedName = encodeURIComponent(input.name);
    return this.client.get<ServerResponse<PlaylistContentDto[]>>(
      `${this.baseUrl}${encodedName}/tracks`,
    );
  }

  public createPlaylist(input: CreateUserPlaylistInput): Observable<ServerResponse<PlaylistDto>> {
    const encodedName = encodeURIComponent(input.name);
    return this.client.post<ServerResponse<PlaylistDto>>(`${this.baseUrl}${encodedName}`, null);
  }

  public addTrackToPlaylist(
    input: AddTrackToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName = encodeURIComponent(input.name);
    const encodedTrackId = encodeURIComponent(input.trackId);
    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/tracks/${encodedTrackId}`,
      null,
    );
  }

  public addAllTracksToPlaylist(
    input: AddTracksToPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName = encodeURIComponent(input.name);
    return this.client.post<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/tracks`,
      input.trackIds,
    );
  }

  public deletePlaylist(input: DeletePlaylistInput): Observable<ServerResponse<null>> {
    const encodedName = encodeURIComponent(input.name);
    return this.client.delete<ServerResponse<null>>(`${this.baseUrl}${encodedName}`);
  }

  public deleteTrackFromPlaylist(
    input: DeleteTrackFromPlaylistInput,
  ): Observable<ServerResponse<PlaylistDto>> {
    const encodedName = encodeURIComponent(input.name);
    const encodedTrackId = encodeURIComponent(input.trackId);
    return this.client.delete<ServerResponse<PlaylistDto>>(
      `${this.baseUrl}${encodedName}/tracks/${encodedTrackId}`,
    );
  }
}

