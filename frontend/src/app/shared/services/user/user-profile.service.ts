import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ServerResponse, UserDto, UserSummaryDto } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly baseUrl = `${environment.api.baseUrl}users/`;

  constructor(private readonly client: HttpClient) {}

  public getCurrentUser(): Observable<ServerResponse<UserDto>> {
    return this.client.get<ServerResponse<UserDto>>(`${this.baseUrl}current`);
  }

  public getCurrentUserSummary(): Observable<ServerResponse<UserSummaryDto>> {
    return this.client.get<ServerResponse<UserSummaryDto>>(`${this.baseUrl}current/summary`);
  }
}
