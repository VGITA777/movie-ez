import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractMediaBackendService } from './abstract-media-backend-service';
import {
  SearchMovieInput,
  SearchMovieResultsModel,
  SearchMultiInput,
  SearchMultiResultsModel,
  SearchTvInput,
  SearchTvSeriesResultsModel,
} from '@shared/models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaSearchService extends AbstractMediaBackendService {
  constructor() {
    super(`${environment.api.mediaBaseUrl}search/`);
  }

  public searchMovie(input: SearchMovieInput): Observable<SearchMovieResultsModel> {
    return this.performRequest<SearchMovieResultsModel, SearchMovieInput>('movie', input);
  }

  public searchTvSeries(input: SearchTvInput): Observable<SearchTvSeriesResultsModel> {
    return this.performRequest<SearchTvSeriesResultsModel, SearchTvInput>('tv', input);
  }

  public searchMulti(input: SearchMultiInput): Observable<SearchMultiResultsModel> {
    return this.performRequest<SearchMultiResultsModel, SearchMultiInput>('multi', input);
  }
}
