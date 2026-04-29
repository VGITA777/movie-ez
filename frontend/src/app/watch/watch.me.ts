import { Component, computed, effect, inject, ResourceRef, Signal } from '@angular/core';
import { z } from 'zod';
import {
  MEDIA_TYPES,
  MediaType,
  MovieDetailsModel,
  TvSeriesDetailsModel,
  VideosModel,
} from '@shared/models';
import { queryParams } from '@signality/core';
import { MediaMovieService } from '@shared/services/media-movie.service';
import { MediaTvSeries } from '@shared/services/media-tv-series';
import { Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { TvData } from '@shared/tv-data';
import { MovieData } from '@shared/movie-data';
import { NavigationFacade } from '@shared/navigation-facade.service';
import { convertRuntimeToHoursAndMinutes, getYearFromDate } from '@shared/utils';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideStar } from '@ng-icons/lucide';

export type MediaData = MovieData | TvData;

export const watchPageQueryParams = z.object({
  type: z.enum(MEDIA_TYPES).readonly(),
  id: z.coerce.number().readonly(),
  season: z.number().optional(),
  episode: z.number().optional(),
});

@Component({
  selector: 'me-watch',
  imports: [HlmIconImports],
  templateUrl: './watch.me.html',
  styleUrl: './watch.me.css',
  providers: [provideIcons({ lucideStar })],
})
export class WatchMe {
  private readonly movieService: MediaMovieService = inject(MediaMovieService);
  private readonly tvSeries: MediaTvSeries = inject(MediaTvSeries);
  private readonly queryParams = queryParams({ schema: watchPageQueryParams });
  private readonly mediaObject: Signal<MovieData | TvData | undefined> = computed(() => {
    const values = this.queryParams.value();
    switch (values.type) {
      case 'movie':
        return new MovieData(values.id, this.movieService);
      case 'tv':
        return new TvData(values.id, this.tvSeries);
      default:
        return undefined;
    }
  });
  private readonly mediaDetails: ResourceRef<MovieDetailsModel | TvSeriesDetailsModel | undefined> =
    rxResource({
      params: (): MediaData | undefined => this.mediaObject(),
      stream: (data): Observable<MovieDetailsModel | TvSeriesDetailsModel | undefined> => {
        if (data === undefined) {
          return of(undefined);
        }
        return data.params.getDetails().pipe();
      },
    });

  protected readonly mediaVideos: ResourceRef<VideosModel | undefined> = rxResource({
    params: (): MediaData | undefined => this.mediaObject(),
    stream: (data): Observable<VideosModel | undefined> => {
      if (data === undefined) {
        return of(undefined);
      }
      return data.params.getVideos().pipe();
    },
  });
  protected readonly movieDetails: Signal<MovieDetailsModel | undefined> = computed(() => {
    const mediaType: MediaType | undefined = this.mediaDetails.value()?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'tv') {
      return undefined;
    }
    return this.mediaDetails.value() as MovieDetailsModel;
  });
  protected readonly tvDetails: Signal<TvSeriesDetailsModel | undefined> = computed(() => {
    const mediaType: MediaType | undefined = this.mediaDetails.value()?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'movie') {
      return undefined;
    }
    return this.mediaDetails.value() as TvSeriesDetailsModel;
  });

  private readonly navFacade = inject(NavigationFacade);

  constructor() {
    effect(() => {
      console.debug(`Movie Details`, this.movieDetails());
    });

    effect(() => {
      console.debug(`Tv Details`, this.tvDetails());
    });

    effect(() => {
      console.debug(`Query Params`, this.queryParams.value());
    });
  }

  protected handleClick() {
    this.navFacade.navigateToHomePage();
  }

  protected readonly convertRuntimeToHoursAndMinutes = convertRuntimeToHoursAndMinutes;
  protected readonly getYearFromDate = getYearFromDate;
}
