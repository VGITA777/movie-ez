import {
  CreditsModel,
  ImagesModel,
  LanguageCode,
  TvSeriesDetailsModel,
  TvSeriesKeywordsModel,
  TvSeriesLatestModel,
  TvSeriesRecommendationsModel,
  TvSeriesSimilarModel,
  VideosModel,
} from '@shared/models';
import { MediaTvSeries } from '@shared/services/media-tv-series';
import { Observable } from 'rxjs';

export class TvData {
  private readonly id: number;
  private readonly tvSeries: MediaTvSeries;

  constructor(id: number, tvSeries: MediaTvSeries) {
    this.id = id;
    this.tvSeries = tvSeries;
  }

  public getId(): number {
    return this.id;
  }

  public getCredits(language?: LanguageCode): Observable<CreditsModel> {
    return this.tvSeries.getTvSeriesCredits(this.id, language);
  }

  public getDetails(language?: LanguageCode): Observable<TvSeriesDetailsModel> {
    return this.tvSeries.getTvSeriesDetails(this.id, language);
  }

  public getImages(language?: LanguageCode): Observable<ImagesModel> {
    return this.tvSeries.getTvSeriesImages(this.id, language);
  }

  public getKeywords(): Observable<TvSeriesKeywordsModel> {
    return this.tvSeries.getTvSeriesKeywords(this.id);
  }

  public getLatest(): Observable<TvSeriesLatestModel> {
    return this.tvSeries.getLatestTvSeries();
  }

  public getRecommendations(
    language?: LanguageCode,
    page?: number,
  ): Observable<TvSeriesRecommendationsModel> {
    return this.tvSeries.getTvSeriesRecommendations(this.id, language, page);
  }

  public getSimilar(language?: LanguageCode, page?: number): Observable<TvSeriesSimilarModel> {
    return this.tvSeries.getTvSeriesSimilar(this.id, language, page);
  }

  public getVideos(language?: LanguageCode): Observable<VideosModel> {
    return this.tvSeries.getTvSeriesVideos(this.id, language);
  }
}
