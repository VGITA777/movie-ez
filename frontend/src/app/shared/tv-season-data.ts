import { MediaTvSeriesSeasonService } from './services/media/media-tv-series-season.service';
import { LanguageCode, TvSeasonDetailsModel } from '@shared/models';
import { Observable } from 'rxjs';

export class TvSeasonData {
  private readonly id: number;
  private readonly seasonNumber: number;
  private readonly service: MediaTvSeriesSeasonService;

  constructor(id: number, seasonNumber: number, service: MediaTvSeriesSeasonService) {
    this.id = id;
    this.seasonNumber = seasonNumber;
    this.service = service;
  }

  public getId(): number {
    return this.id;
  }

  public getSeasonNumber(): number {
    return this.seasonNumber;
  }

  public getDetails(language: LanguageCode = 'en'): Observable<TvSeasonDetailsModel> {
    return this.service.getTvSeriesSeasonDetails({
      seriesId: this.id,
      seasonNumber: this.seasonNumber,
      language: language,
    });
  }
}
