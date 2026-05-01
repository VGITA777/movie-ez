import { AbstractMediaBackendService } from '@shared/services/abstract-media-backend-service';
import { environment } from '../../../environments/environment';
import { TvSeasonDetailsInput, TvSeasonDetailsModel } from '@shared/models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

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
