import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  DiscoverMovieModel,
  DiscoverMoviesInput,
  DiscoverTvInput,
  DiscoverTvModel,
  Page,
} from '@shared/models';
import { Observable } from 'rxjs';
import { MediaBackendService } from './media-backend-service';

@Injectable({
  providedIn: 'root',
})
export class MediaDiscoverService extends MediaBackendService {
  constructor() {
    super(`${environment.api.mediaBaseUrl}discover`);
  }

  public discoverMovies(input: DiscoverMoviesInput): Observable<Page<DiscoverMovieModel>> {
    return this.performRequest<Page<DiscoverMovieModel>, DiscoverMoviesInput>('movies', input);
  }

  public discoverTvShows(input: DiscoverTvInput): Observable<Page<DiscoverTvModel>> {
    return this.performRequest<Page<DiscoverTvModel>, DiscoverTvInput>('tv', input);
  }
}
