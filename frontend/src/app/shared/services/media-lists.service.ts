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

  public getMovieNowPlaying(input: MovieListsInput = {}): Observable<MovieNowPlayingModel> {
    return this.performRequest<MovieNowPlayingModel, MovieListsInput>(
      'movie/lists/now-playing',
      input,
    );
  }

  public getMoviePopular(input: MovieListsInput = {}): Observable<MoviePopularModel> {
    return this.performRequest<MoviePopularModel, MovieListsInput>('movie/lists/popular', input);
  }

  public getMovieTopRated(input: MovieListsInput = {}): Observable<MovieTopRatedModel> {
    return this.performRequest<MovieTopRatedModel, MovieListsInput>('movie/lists/top-rated', input);
  }

  public getMovieUpcoming(input: MovieListsInput = {}): Observable<MovieUpcomingModel> {
    return this.performRequest<MovieUpcomingModel, MovieListsInput>('movie/lists/upcoming', input);
  }

  public getTvSeriesAiringToday(
    input: TvSeriesListsInput = {},
  ): Observable<TvSeriesAiringTodayModel> {
    return this.performRequest<TvSeriesAiringTodayModel, TvSeriesListsInput>(
      'tv-series/lists/airing-today',
      input,
    );
  }

  public getTvSeriesOnTheAir(
    input: TvSeriesListsInput = {},
  ): Observable<TvSeriesOnTheAirModel> {
    return this.performRequest<TvSeriesOnTheAirModel, TvSeriesListsInput>(
      'tv-series/lists/on-the-air',
      input,
    );
  }

  public getTvSeriesPopular(
    input: TvSeriesListsInput = {},
  ): Observable<TvSeriesPopularModel> {
    return this.performRequest<TvSeriesPopularModel, TvSeriesListsInput>(
      'tv-series/lists/popular',
      input,
    );
  }

  public getTvSeriesTopRated(
    input: TvSeriesListsInput = {},
  ): Observable<TvSeriesTopRatedModel> {
    return this.performRequest<TvSeriesTopRatedModel, TvSeriesListsInput>(
      'tv-series/lists/top-rated',
      input,
    );
  }
}

