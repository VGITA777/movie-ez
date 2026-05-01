import {Component, computed, effect, EffectRef, inject, OnDestroy, ResourceRef, Signal,} from '@angular/core';
import {z} from 'zod';
import {
  MEDIA_TYPES,
  MediaType,
  MovieDetailsModel,
  MovieSimilarModel,
  TvSeriesDetailsModel,
  TvSeriesSimilarModel,
  VideosModel,
} from '@shared/models';
import {breakpoints, queryParams} from '@signality/core';
import {MediaMovieService} from '@shared/services/media-movie.service';
import {MediaTvSeries} from '@shared/services/media-tv-series';
import {Observable, of} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {TvData} from '@shared/tv-data';
import {MovieData} from '@shared/movie-data';
import {NavigationFacade} from '@shared/navigation-facade.service';
import {convertRuntimeToHoursAndMinutes, getYearFromDate} from '@shared/utils';
import {HlmIconImports} from '@spartan-ng/helm/icon';
import {provideIcons} from '@ng-icons/core';
import {lucidePlus, lucideShare, lucideStar} from '@ng-icons/lucide';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmTooltipImports} from '@spartan-ng/helm/tooltip';
import {HlmSkeletonImports} from '@spartan-ng/helm/skeleton';
import {NgTemplateOutlet} from '@angular/common';
import {EpisodePickerMe} from "@watch/ui/episode-picker/episode-picker.me";

export type MediaData = MovieData | TvData;

export const watchPageQueryParams = z.object({
  type: z.enum(MEDIA_TYPES).readonly(),
  id: z.coerce.number().readonly(),
  season: z.number().optional(),
  episode: z.number().optional(),
});

@Component({
  selector: 'me-watch',
  imports: [
    HlmIconImports,
    HlmButtonImports,
    HlmTooltipImports,
    HlmSkeletonImports,
    NgTemplateOutlet,
    EpisodePickerMe,
  ],
  templateUrl: './watch.me.html',
  styleUrl: './watch.me.css',
  providers: [provideIcons({ lucideStar, lucidePlus, lucideShare })],
})
export class WatchMe implements OnDestroy {
  private readonly navigator: NavigationFacade = inject(NavigationFacade);
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
  private readonly similarMedia: ResourceRef<MovieSimilarModel | TvSeriesSimilarModel | undefined> =
    rxResource({
      params: (): MediaData | undefined => this.mediaObject(),
      stream: (data): Observable<MovieSimilarModel | TvSeriesSimilarModel | undefined> => {
        if (data === undefined) {
          return of(undefined);
        }
        return data.params.getSimilar();
      },
    });

  protected readonly convertRuntimeToHoursAndMinutes = convertRuntimeToHoursAndMinutes;
  protected readonly getYearFromDate = getYearFromDate;
  protected readonly Array = Array;
  protected readonly isLoading: Signal<boolean> = this.mediaDetails.isLoading;
  protected readonly isError: Signal<boolean> = computed(
    () => this.mediaDetails.error() !== undefined,
  );
  protected readonly error: Signal<Error | undefined> = computed(() => this.mediaDetails.error());
  protected readonly bp = breakpoints({
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
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
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const mediaType: MediaType | undefined = this.mediaDetails.value()?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'tv') {
      return undefined;
    }
    return this.mediaDetails.value() as MovieDetailsModel;
  });
  protected readonly tvDetails: Signal<TvSeriesDetailsModel | undefined> = computed(() => {
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const mediaType: MediaType | undefined = this.mediaDetails.value()?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'movie') {
      return undefined;
    }
    return this.mediaDetails.value() as TvSeriesDetailsModel;
  });
  protected readonly movieSimilar: Signal<MovieSimilarModel | undefined> = computed(() => {
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const mediaType: MediaType | undefined = this.similarMedia.value()?.results?.[0]?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'tv') {
      return undefined;
    }
    return this.similarMedia.value() as MovieSimilarModel;
  });
  protected readonly tvSimilar: Signal<TvSeriesSimilarModel | undefined> = computed(() => {
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const mediaType: MediaType | undefined = this.similarMedia.value()?.results?.[0]?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'movie') {
      return undefined;
    }
    return this.similarMedia.value() as TvSeriesSimilarModel;
  });

  private readonly navFacade = inject(NavigationFacade);
  private readonly errorWatcher: EffectRef;

  constructor() {
    this.errorWatcher = effect(() => {
      if (this.mediaDetails.status() === 'error') {
        this.navigator.navigateToHomePage({
          messages: [
            {
              message: 'An error occurred while fetching media details. Please try again later.',
              type: 'error',
            },
          ],
        });
      }
    });
  }

  ngOnDestroy() {
    this.errorWatcher.destroy();
  }

  protected handleClick() {
    this.navFacade.navigateToHomePage();
  }

  private checkIfErrorOrLoading(): boolean {
    return this.mediaDetails.isLoading() || this.mediaDetails.error() !== undefined;
  }
}
