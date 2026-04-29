import { Injectable } from '@angular/core';
import { AbstractMediaBackendService } from '@shared/services/abstract-media-backend-service';
import { environment } from '../../../environments/environment';
import { ID } from '@shared/shared-types';
import {
  CreditsModel,
  ImagesModel,
  TvSeriesDetailsModel,
  TvSeriesKeywordsModel,
  TvSeriesLatestModel,
  TvSeriesRecommendationsModel,
  TvSeriesSimilarModel,
  VideosModel,
  LanguageCode,
} from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaTvSeries extends AbstractMediaBackendService {
  constructor() {
    super(`${environment.api.mediaBaseUrl}tv-series/`);
  }

  public getTvSeriesCredits(
    seriesId: ID,
    language?: LanguageCode,
  ): Observable<CreditsModel> {
    return this.performRequest<CreditsModel, { language?: LanguageCode }>(
      `${seriesId}/credits`,
      { language },
    );
  }

  public getTvSeriesDetails(
    seriesId: ID,
    language?: LanguageCode,
  ): Observable<TvSeriesDetailsModel> {
    return this.performRequest<TvSeriesDetailsModel, { language?: LanguageCode }>(
      `${seriesId}/details`,
      { language },
    );
  }

  public getTvSeriesImages(
    seriesId: ID,
    language?: LanguageCode,
  ): Observable<ImagesModel> {
    return this.performRequest<ImagesModel, { language?: LanguageCode }>(
      `${seriesId}/images`,
      { language },
    );
  }

  public getTvSeriesKeywords(seriesId: ID): Observable<TvSeriesKeywordsModel> {
    return this.performRequest<TvSeriesKeywordsModel, {}>(
      `${seriesId}/keywords`,
      {},
    );
  }

  public getLatestTvSeries(): Observable<TvSeriesLatestModel> {
    return this.performRequest<TvSeriesLatestModel, {}>(`latest`, {});
  }

  public getTvSeriesRecommendations(
    seriesId: ID,
    language?: LanguageCode,
    page?: number,
  ): Observable<TvSeriesRecommendationsModel> {
    return this.performRequest<
      TvSeriesRecommendationsModel,
      { language?: LanguageCode; page?: number }
    >(`${seriesId}/recommendations`, { language, page });
  }

  public getTvSeriesSimilar(
    seriesId: ID,
    language?: LanguageCode,
    page?: number,
  ): Observable<TvSeriesSimilarModel> {
    return this.performRequest<
      TvSeriesSimilarModel,
      { language?: LanguageCode; page?: number }
    >(`${seriesId}/similar`, { language, page });
  }

  public getTvSeriesVideos(
    seriesId: ID,
    language?: LanguageCode,
  ): Observable<VideosModel> {
    return this.performRequest<VideosModel, { language?: LanguageCode }>(
      `${seriesId}/videos`,
      { language },
    );
  }
}
