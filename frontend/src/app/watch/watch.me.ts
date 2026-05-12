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
  MEDIA_TYPES,
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
import { Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { TvData } from '@shared/tv-data';
import { MovieData } from '@shared/movie-data';
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

export type MediaData = MovieData | TvData;

export const watchPageQueryParams = z.object({
  type: z.enum(MEDIA_TYPES).readonly(),
  id: z.coerce.number().readonly(),
  season: z.coerce.number().optional(),
  episode: z.coerce.number().optional(),
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
  private readonly navigator: NavigationFacade = inject(NavigationFacade);
  private readonly movieService: MediaMovieService = inject(MediaMovieService);
  private readonly tvSeries: MediaTvSeriesService = inject(MediaTvSeriesService);
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

  protected readonly queryParams = queryParams({ schema: watchPageQueryParams });
  protected readonly convertRuntimeToHoursAndMinutes = convertRuntimeToHoursAndMinutes;
  protected readonly getYearFromDate = getYearFromDate;
  protected readonly Array = Array;
  protected readonly mediaId: Signal<number> = computed(() => this.queryParams.value().id ?? 0);
  protected readonly mediaType: Signal<MediaType> = computed(() => this.queryParams.value().type);
  protected readonly isLoading: Signal<boolean> = this.mediaDetails.isLoading;
  protected readonly error: Signal<Error | undefined> = computed(() => this.mediaDetails.error());
  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);
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
  protected readonly similarMedia: ResourceRef<
    MovieSimilarModel | TvSeriesSimilarModel | undefined
  > = rxResource({
    params: (): MediaData | undefined => this.mediaObject(),
    stream: (data): Observable<MovieSimilarModel | TvSeriesSimilarModel | undefined> => {
      if (data === undefined) {
        return of(undefined);
      }
      return data.params.getSimilar();
    },
  });
  protected readonly similarMediaCarouselItems: Signal<MediaCarouselItem[]> = computed(() => {
    const items: MovieSimilarModel | TvSeriesSimilarModel | undefined = this.similarMedia.value();
    if (!items || !items.results) {
      return [];
    }

    const extractYear = (
      item: MovieShortDetailsWithMediaTypeModel | TvSeriesShortDetailsModelWithMediaTypeModel,
    ): number => {
      const dateStr =
        (item as MovieShortDetailsWithMediaTypeModel).release_date ??
        (item as TvSeriesShortDetailsModelWithMediaTypeModel).first_air_date;
      return getYearFromDate(dateStr) ?? 0;
    };

    return items.results.map(
      (
        item: MovieShortDetailsWithMediaTypeModel | TvSeriesShortDetailsModelWithMediaTypeModel,
      ): MediaCarouselItem => ({
        id: item.id,
        title:
          (item as MovieShortDetailsWithMediaTypeModel).title ??
          (item as TvSeriesShortDetailsModelWithMediaTypeModel).name ??
          '',
        imgSrc: `${environment.tmdb.imageBaseUrl}original/${item.poster_path}`,
        rating: item.vote_average,
        year: extractYear(item),
        type: item.media_type,
      }),
    );
  });
  protected readonly similarMovies: Signal<MovieSimilarModel | undefined> = computed(() => {
    if (this.checkIfErrorOrLoading()) {
      return undefined;
    }

    const mediaType: MediaType | undefined = this.similarMedia.value()?.results?.[0]?.media_type;
    if (!mediaType || mediaType === 'person' || mediaType === 'tv') {
      return undefined;
    }
    return this.similarMedia.value() as MovieSimilarModel;
  });
  protected readonly similarTvSeries: Signal<TvSeriesSimilarModel | undefined> = computed(() => {
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
  private readonly showSiteLogoNavigationToast: WritableSignal<boolean> = storage(
    'showSiteLogoNavigationToast',
    true,
  );

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

  public ngOnDestroy() {
    this.errorWatcher.destroy();
  }

  public ngAfterViewInit() {
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

  protected handleClick() {
    this.navFacade.navigateToHomePage();
  }

  private checkIfErrorOrLoading(): boolean {
    return this.mediaDetails.isLoading() || this.mediaDetails.error() !== undefined;
  }

  protected handleOnEpisodeClicked(ep: TvSeasonDetailsEpisode) {
    const queryParams = this.queryParams.value();
    this.navigator.navigateToWatchPage({
      episode: ep.episode_number,
      mediaId: queryParams.id,
      mediaType: queryParams.type,
      season: queryParams.season,
      extras: {
        replaceUrl: true,
      },
    });
  }

  protected navigateToWatchPage(event: MediaCarouselItem) {
    this.navigator.navigateToWatchPage({
      mediaId: event.id,
      mediaType: event.type,
    });
  }
}
