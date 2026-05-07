import { Injectable } from '@angular/core';
import { AbstractMediaBackendService } from './abstract-media-backend-service';
import {
  CountryCode,
  CreditsModel,
  ImagesModel,
  LanguageCode,
  MovieAlternativeTitlesModel,
  MovieDetailsModel,
  MovieKeywordsModel,
  MovieLatestModel,
  MovieRecommendationsModel,
  MovieSimilarModel,
  VideosModel,
} from '@shared/models';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ID } from '@shared/shared-types';

@Injectable({
  providedIn: 'root',
})
export class MediaMovieService extends AbstractMediaBackendService {
  constructor() {
    super(`${environment.api.mediaBaseUrl}movie/`);
  }

  public getMovieAlternativeTitles(
    id: ID,
    countryCode?: CountryCode,
  ): Observable<MovieAlternativeTitlesModel> {
    return this.performRequest<MovieAlternativeTitlesModel, { country?: CountryCode }>(
      `${id}/alternative-titles`,
      { country: countryCode },
    );
  }

  public getMovieCredits(id: ID, language?: LanguageCode): Observable<CreditsModel> {
    return this.performRequest<CreditsModel, { language?: LanguageCode }>(`${id}/credits`, {
      language,
    });
  }

  public getMovieDetails(id: ID, language?: LanguageCode): Observable<MovieDetailsModel> {
    return this.performRequest<MovieDetailsModel, { language?: LanguageCode }>(`${id}/details`, {
      language,
    });
  }

  public getMovieImages(id: ID, language?: LanguageCode): Observable<ImagesModel> {
    return this.performRequest<ImagesModel, { language?: LanguageCode }>(`${id}/images`, {
      language,
    });
  }

  public getMovieKeywords(id: ID): Observable<MovieKeywordsModel> {
    return this.performRequest<MovieKeywordsModel, {}>(`${id}/keywords`, {});
  }

  public getLatest(): Observable<MovieLatestModel> {
    return this.performRequest<MovieLatestModel, {}>(`latest`, {});
  }

  public getMovieRecommendations(
    id: ID,
    language?: LanguageCode,
    page?: number,
  ): Observable<MovieRecommendationsModel> {
    return this.performRequest<
      MovieRecommendationsModel,
      { language?: LanguageCode; page?: number }
    >(`${id}/recommendations`, { language, page });
  }

  public getMovieSimilar(
    id: ID,
    language?: LanguageCode,
    page?: number,
  ): Observable<MovieSimilarModel> {
    return this.performRequest<MovieSimilarModel, { language?: LanguageCode; page?: number }>(
      `${id}/similar`,
      { language, page },
    );
  }

  public getMovieVideos(id: ID, language?: LanguageCode): Observable<VideosModel> {
    return this.performRequest<VideosModel, { language?: LanguageCode }>(`${id}/videos`, {
      language,
    });
  }
}
