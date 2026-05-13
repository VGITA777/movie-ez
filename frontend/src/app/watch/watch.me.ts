import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  OnDestroy,
  ResourceRef,
  Signal,
  WritableSignal,
} from '@angular/core';
import { z } from 'zod';
import {
  MediaType,
  MovieDetailsModel,
  MovieShortDetailsWithMediaTypeModel,
  MovieSimilarModel,
  TvSeasonDetailsEpisode,
  TvSeriesDetailsModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
  TvSeriesSimilarModel,
  VideosModel,
} from '@shared/models';
import { breakpoints, queryParams, storage } from '@signality/core';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series-series.service';
import { catchError, Observable, of, take } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import { convertRuntimeToHoursAndMinutes, getYearFromDate } from '@shared/utils';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideShare, lucideStar } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgTemplateOutlet } from '@angular/common';
import { EpisodePickerMe } from '@watch/features/episode-picker/episode-picker.me';
import { DEFAULT_BREAKPOINTS } from '@shared/shared-types';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { MediaCarouselItem, MediaCarouselMe } from '@shared/ui/media-carousel/media-carousel.me';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmCard } from '@spartan-ng/helm/card';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { environment } from '@environments/environment';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { CollapsibleTextMe } from '@shared/ui/collapsible-text/collapsible-text.me';
import { ShowPlaylistsDirective } from '@shared/directives/show-playlists-directive';
import { toast } from '@spartan-ng/brain/sonner';

export type WatchMediaType = MediaType.MOVIE | MediaType.TV;

export type WatchMediaParams = {
  type: WatchMediaType;
  id: number;
};

export type MediaData = WatchMediaParams;

const WATCH_PAGE_MEDIA_TYPES = [MediaType.MOVIE, MediaType.TV] as const;

export const watchPageQueryParams = z.object({
  // Watch page should only accept playable media.
  // Person is still valid in the global MediaType enum, but not here.
  type: z.enum(WATCH_PAGE_MEDIA_TYPES).readonly(),
  id: z.coerce.number().int().positive().readonly(),
  season: z.coerce.number().int().positive().optional(),
  episode: z.coerce.number().int().positive().optional(),
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
    HlmScrollArea,
    MediaCarouselMe,
    NgScrollbar,
    HlmCard,
    MediaCarouselCoverItemMe,
    HlmSeparatorImports,
    CollapsibleTextMe,
    ShowPlaylistsDirective,
  ],
  templateUrl: './watch.me.html',
  styleUrl: './watch.me.css',
  providers: [provideIcons({ lucideStar, lucidePlus, lucideShare })],
})
export class WatchMe implements OnDestroy, AfterViewInit {
  private readonly errorWatcher: EffectRef;
  private readonly navFacade: NavigationFacade = inject(NavigationFacade);
  private readonly movieService: MediaMovieService = inject(MediaMovieService);
  private readonly tvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly showSiteLogoNavigationToast: WritableSignal<boolean> = storage(
    'showSiteLogoNavigationToast',
    true,
  );
  private readonly mediaParams: Signal<WatchMediaParams> = computed(() => {
    const params = this.queryParams.value();

    return {
      id: params.id,
      type: params.type,
    };
  });
  private readonly mediaDetails: ResourceRef<MovieDetailsModel | TvSeriesDetailsModel | undefined> =
    rxResource({
      params: (): WatchMediaParams => this.mediaParams(),
      stream: ({ params }): Observable<MovieDetailsModel | TvSeriesDetailsModel> => {
        return this.getMediaDetails(params).pipe(take(1));
      },
    });

  protected readonly queryParams = queryParams({ schema: watchPageQueryParams });
  protected readonly convertRuntimeToHoursAndMinutes = convertRuntimeToHoursAndMinutes;
  protected readonly getYearFromDate = getYearFromDate;
  protected readonly Array = Array;
  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);
  protected readonly mediaId: Signal<number> = computed(() => this.queryParams.value().id);
  protected readonly mediaType: Signal<WatchMediaType> = computed(() => {
    return this.queryParams.value().type;
  });
  protected readonly mediaVideos: ResourceRef<VideosModel> = rxResource({
    defaultValue: this.emptyVideos(),
    params: (): WatchMediaParams => this.mediaParams(),
    stream: ({ params }): Observable<VideosModel> => {
      return this.getMediaVideos(params).pipe(
        take(1),
        catchError((error) => {
          console.error(`Failed to load videos for ${params.type}/${params.id}:`, error);
          return of(this.emptyVideos());
        }),
      );
    },
  });
  protected readonly similarMedia: ResourceRef<MovieSimilarModel | TvSeriesSimilarModel> =
    rxResource({
      defaultValue: this.emptySimilarMedia(),
      params: (): WatchMediaParams => this.mediaParams(),
      stream: ({ params }): Observable<MovieSimilarModel | TvSeriesSimilarModel> => {
        return this.getSimilarMedia(params).pipe(
          take(1),
          catchError((error) => {
            console.error(`Failed to load similar media for ${params.type}/${params.id}:`, error);
            return of(this.emptySimilarMedia());
          }),
        );
      },
    });
  protected readonly isLoading: Signal<boolean> = this.mediaDetails.isLoading;
  protected readonly error: Signal<Error | undefined> = computed(() => {
    return this.mediaDetails.error();
  });
  protected readonly movieDetails: Signal<MovieDetailsModel | undefined> = computed(() => {
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const details = this.mediaDetails.value();

    if (!details || this.mediaType() !== MediaType.MOVIE) {
      return undefined;
    }

    return details as MovieDetailsModel;
  });
  protected readonly tvDetails: Signal<TvSeriesDetailsModel | undefined> = computed(() => {
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const details = this.mediaDetails.value();

    if (!details || this.mediaType() !== MediaType.TV) {
      return undefined;
    }

    return details as TvSeriesDetailsModel;
  });
  protected readonly similarMediaCarouselItems: Signal<MediaCarouselItem[]> = computed(() => {
    const similar = this.similarMedia.value();

    if (!similar.results || similar.results.length === 0) {
      return [];
    }

    return similar.results
      .filter((item) => item.media_type === MediaType.MOVIE || item.media_type === MediaType.TV)
      .map((item) => this.toSimilarCarouselItem(item));
  });
  protected readonly similarMovies: Signal<MovieSimilarModel | undefined> = computed(() => {
    if (this.mediaType() !== MediaType.MOVIE) {
      return undefined;
    }

    return this.similarMedia.value() as MovieSimilarModel;
  });
  protected readonly similarTvSeries: Signal<TvSeriesSimilarModel | undefined> = computed(() => {
    if (this.mediaType() !== MediaType.TV) {
      return undefined;
    }

    return this.similarMedia.value() as TvSeriesSimilarModel;
  });

  constructor() {
    this.errorWatcher = effect(() => {
      if (this.mediaDetails.status() === 'error') {
        this.navFacade.navigateToHomePage({
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

  public ngOnDestroy(): void {
    this.errorWatcher.destroy();
  }

  public ngAfterViewInit(): void {
    if (this.showSiteLogoNavigationToast()) {
      toast.info('Click the Site Logo to go Home!', {
        duration: 8000,
        position: 'top-right',
        action: {
          label: 'Ok',
          onClick: () => this.showSiteLogoNavigationToast.set(false),
        },
      });
    }
  }

  protected handleClick(): void {
    this.navFacade.navigateToHomePage();
  }

  protected handleOnEpisodeClicked(ep: TvSeasonDetailsEpisode): void {
    const queryParams = this.queryParams.value();

    this.navFacade.navigateToWatchPage({
      episode: ep.episode_number,
      mediaId: queryParams.id,
      mediaType: queryParams.type,
      season: queryParams.season,
      extras: {
        replaceUrl: true,
      },
    });
  }

  protected navigateToWatchPage(event: MediaCarouselItem): void {
    this.navFacade.navigateToWatchPage({
      mediaId: event.id,
      mediaType: event.type,
    });
  }

  private getMediaDetails(
    params: WatchMediaParams,
  ): Observable<MovieDetailsModel | TvSeriesDetailsModel> {
    return params.type === MediaType.MOVIE
      ? this.movieService.getMovieDetails(params.id)
      : this.tvSeriesService.getTvSeriesDetails(params.id);
  }

  private getMediaVideos(params: WatchMediaParams): Observable<VideosModel> {
    return params.type === MediaType.MOVIE
      ? this.movieService.getMovieVideos(params.id)
      : this.tvSeriesService.getTvSeriesVideos(params.id);
  }

  private getSimilarMedia(
    params: WatchMediaParams,
  ): Observable<MovieSimilarModel | TvSeriesSimilarModel> {
    return params.type === MediaType.MOVIE
      ? this.movieService.getMovieSimilar(params.id)
      : this.tvSeriesService.getTvSeriesSimilar(params.id);
  }

  private checkIfErrorOrLoading(): boolean {
    return this.mediaDetails.isLoading() || this.mediaDetails.error() !== undefined;
  }

  private toSimilarCarouselItem(
    item: MovieShortDetailsWithMediaTypeModel | TvSeriesShortDetailsModelWithMediaTypeModel,
  ): MediaCarouselItem {
    const isMovie = item.media_type === MediaType.MOVIE;

    const title = isMovie
      ? (item as MovieShortDetailsWithMediaTypeModel).title
      : (item as TvSeriesShortDetailsModelWithMediaTypeModel).name;

    const date = isMovie
      ? (item as MovieShortDetailsWithMediaTypeModel).release_date
      : (item as TvSeriesShortDetailsModelWithMediaTypeModel).first_air_date;

    return {
      id: item.id,
      title: title ?? '',
      imgSrc: this.toTmdbImageUrl(item.poster_path),
      rating: item.vote_average,
      year: getYearFromDate(date) ?? 0,
      type: item.media_type,
    };
  }

  private toTmdbImageUrl(path: string | null | undefined): string {
    if (!path) {
      return '';
    }

    return `${environment.tmdb.imageBaseUrl}original${path}`;
  }

  private emptyVideos(): VideosModel {
    return {} as VideosModel;
  }

  private emptySimilarMedia(): MovieSimilarModel | TvSeriesSimilarModel {
    return {} as MovieSimilarModel | TvSeriesSimilarModel;
  }
}
