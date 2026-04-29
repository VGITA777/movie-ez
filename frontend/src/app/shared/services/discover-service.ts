import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DiscoverMovieModel,
  DiscoverMoviesInput,
  DiscoverTvInput,
  DiscoverTvModel,
  Page,
} from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscoverService {
  private readonly client: HttpClient = inject(HttpClient);
  private readonly discoverBaseUrl: string = `${environment.api.mediaBaseUrl}discover/`;

  public discoverMovies(input: DiscoverMoviesInput): Observable<Page<DiscoverMovieModel>> {
    return this.performRequest<Page<DiscoverMovieModel>, DiscoverMoviesInput>('movies', input);
  }

  public discoverTvShows(input: DiscoverTvInput): Observable<Page<DiscoverTvModel>> {
    return this.performRequest<Page<DiscoverTvModel>, DiscoverTvInput>('tv', input);
  }

  private performRequest<T extends object, I extends object>(
    endpoint: string,
    input: I,
  ): Observable<T> {
    const convertedInput: Record<string, any> = this.buildHttpParams(input);
    const httpParam: HttpParams = new HttpParams({ fromObject: convertedInput });
    return this.client.get<T>(`${this.discoverBaseUrl}${endpoint}`, {
      params: httpParam,
    });
  }

  private buildHttpParams<T extends object>(data: T): Record<string, any> {
    return Object.entries(data).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, []);
  }
}
