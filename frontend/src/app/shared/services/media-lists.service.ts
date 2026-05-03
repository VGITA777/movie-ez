import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AbstractMediaBackendService } from '@shared/services/abstract-media-backend-service';
import {
  MovieListsInput,
  MovieNowPlayingModel,
  MoviePopularModel,
  MovieTopRatedModel,
  MovieUpcomingModel,
  TvSeriesAiringTodayModel,
  TvSeriesListsInput,
  TvSeriesOnTheAirModel,
  TvSeriesPopularModel,
  TvSeriesTopRatedModel,
} from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class MediaListsService extends AbstractMediaBackendService {
  constructor() {
    super(environment.api.mediaBaseUrl);
  }

  public getMovieNowPlaying(
    input: MovieListsInput = { page: 1 },
  ): Observable<MovieNowPlayingModel> {
    return this.performRequest<MovieNowPlayingModel, MovieListsInput>(
      'movie/lists/now-playing',
      input,
    );
  }

  public getMoviePopular(input: MovieListsInput = { page: 1 }): Observable<MoviePopularModel> {
    return this.performRequest<MoviePopularModel, MovieListsInput>('movie/lists/popular', input);
  }

  public getMovieTopRated(input: MovieListsInput = { page: 1 }): Observable<MovieTopRatedModel> {
    return this.performRequest<MovieTopRatedModel, MovieListsInput>('movie/lists/top-rated', input);
  }

  public getMovieUpcoming(input: MovieListsInput = { page: 1 }): Observable<MovieUpcomingModel> {
    return this.performRequest<MovieUpcomingModel, MovieListsInput>('movie/lists/upcoming', input);
  }

  public getTvSeriesAiringToday(
    input: TvSeriesListsInput = { page: 1 },
  ): Observable<TvSeriesAiringTodayModel> {
    return this.performRequest<TvSeriesAiringTodayModel, TvSeriesListsInput>(
      'tv-series/lists/airing-today',
      input,
    );
  }

  public getTvSeriesOnTheAir(
    input: TvSeriesListsInput = { page: 1 },
  ): Observable<TvSeriesOnTheAirModel> {
    return this.performRequest<TvSeriesOnTheAirModel, TvSeriesListsInput>(
      'tv-series/lists/on-the-air',
      input,
    );
  }

  public getTvSeriesPopular(
    input: TvSeriesListsInput = { page: 1 },
  ): Observable<TvSeriesPopularModel> {
    return this.performRequest<TvSeriesPopularModel, TvSeriesListsInput>(
      'tv-series/lists/popular',
      input,
    );
  }

  public getTvSeriesTopRated(
    input: TvSeriesListsInput = { page: 1 },
  ): Observable<TvSeriesTopRatedModel> {
    return this.performRequest<TvSeriesTopRatedModel, TvSeriesListsInput>(
      'tv-series/lists/top-rated',
      input,
    );
  }
}
