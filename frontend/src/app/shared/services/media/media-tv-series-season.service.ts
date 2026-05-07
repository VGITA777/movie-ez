import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AbstractMediaBackendService } from '@shared/services/media/abstract-media-backend-service';
import { TvSeasonDetailsInput, TvSeasonDetailsModel } from '@shared/models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaTvSeriesSeasonService extends AbstractMediaBackendService {
  constructor() {
    super(`${environment.api.mediaBaseUrl}tv-series/`);
  }

  public getTvSeriesSeasonDetails(input: TvSeasonDetailsInput): Observable<TvSeasonDetailsModel> {
    return this.performRequest(`${input.seriesId}/${input.seasonNumber}/details`, {
      language: input.language,
    });
  }
}
