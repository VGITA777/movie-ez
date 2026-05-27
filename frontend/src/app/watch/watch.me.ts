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
  CreditsCast,
  CreditsModel,
  MediaType,
  MovieDetailsModel,
  MovieShortDetailsWithMediaTypeModel,
  MovieSimilarModel,
  TvSeasonDetailsEpisode,
  TvSeriesDetailsModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
  TvSeriesSimilarModel,
  Video,
  VideosModel,
  WatchProviderRegion,
  WatchProvidersModel,
} from '@shared/models';
import { breakpoints, queryParams, storage } from '@signality/core';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series.service';
import { catchError, map, Observable, of, take } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import {
  convertRuntimeToHoursAndMinutes,
  getYearFromDate,
  normalizeGenres,
  toGenres,
  toTmdbImageUrl,
} from '@shared/utils';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideFilm, lucidePlus, lucideShare, lucideStar, lucideUsers } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { EpisodePickerMe } from '@watch/features/episode-picker/episode-picker.me';
import { DEFAULT_BREAKPOINTS } from '@shared/shared-types';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { MediaCarouselItem, MediaCarouselMe } from '@shared/ui/media-carousel/media-carousel.me';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import {
  DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES,
  MediaCarouselCoverItemMe,
} from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { CollapsibleTextMe } from '@shared/ui/collapsible-text/collapsible-text.me';
import { ShowPlaylistsDirective } from '@shared/directives/show-playlists-directive';
import { toast } from '@spartan-ng/brain/sonner';
import { YouTubePlayer } from '@angular/youtube-player';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { UserSettings, UserSettingService } from '@shared/services/user/user-setting.service';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { ASSETS_PATHS } from '@shared/constants';

export type WatchMediaType = MediaType.MOVIE | MediaType.TV;
export type WatchMediaParams = {
  type: WatchMediaType;
  id: number;
};

type WatchProviderItem = {
  id: number;
  name: string;
  logoUrl: string;
  link: string;
};

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
    YouTubePlayer,
    NgOptimizedImage,
    HlmCardImports,
    HlmItemImports,
    HlmAvatarImports,
  ],
  templateUrl: './watch.me.html',
  styleUrl: './watch.me.css',
  providers: [provideIcons({ lucideStar, lucidePlus, lucideShare, lucideFilm, lucideUsers })],
})
export class WatchMe implements OnDestroy, AfterViewInit {
  private readonly errorWatcher: EffectRef;
  private readonly navFacade: NavigationFacade = inject(NavigationFacade);
  private readonly movieService: MediaMovieService = inject(MediaMovieService);
  private readonly tvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly userSettingsService: UserSettingService = inject(UserSettingService);
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
  private readonly credits: ResourceRef<CreditsModel | undefined> = rxResource({
    params: (): WatchMediaParams => this.mediaParams(),
    stream: ({ params }) => {
      const { id, type } = params;
      switch (type) {
        case MediaType.MOVIE:
          return this.movieService.getMovieCredits(id).pipe(take(1));
        case MediaType.TV:
          return this.tvSeriesService.getTvSeriesCredits(id).pipe(take(1));
      }
    },
  });
  private readonly videos: ResourceRef<Video[]> = rxResource({
    defaultValue: [],
    params: (): WatchMediaParams => this.mediaParams(),
    stream: ({ params }): Observable<Video[]> => {
      return this.getMediaVideos(params).pipe(
        take(1),
        map((videos) => videos.results ?? []),
        catchError((error) => {
          console.error(
            `Failed to load videos for ${params.type}/${params.id}. Videos will be unavailable.`,
            error,
          );

          return of([]);
        }),
      );
    },
  });
  private readonly watchProviders: ResourceRef<WatchProvidersModel | undefined> = rxResource({
    params: (): WatchMediaParams => this.mediaParams(),
    stream: ({ params }) => {
      const { id, type } = params;
      switch (type) {
        case MediaType.MOVIE:
          return this.movieService.getMovieWatchProviders(id).pipe(take(1));
        case MediaType.TV:
          return this.tvSeriesService.getTvSeriesWatchProviders(id).pipe(take(1));
      }
    },
  });
  private readonly userSettings: Signal<UserSettings> = this.userSettingsService.userSettings;

  protected readonly DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES =
    DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES;
  protected readonly skeletonCount: number[] = Array.from({ length: 10 }, (_, i) => i);
  protected readonly genresSkeletonCount: number[] = Array.from({ length: 2 }, (_, i) => i);
  protected readonly watchProviderSkeletonCount: number[] = Array.from({ length: 5 }, (_, i) => i);
  protected readonly queryParams = queryParams({ schema: watchPageQueryParams });
  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);
  protected readonly mediaId: Signal<number> = computed(() => this.queryParams.value().id);
  protected readonly mediaType: Signal<WatchMediaType> = computed(() => {
    return this.queryParams.value().type;
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
  protected readonly isSimilarMediaLoading: Signal<boolean> = this.similarMedia.isLoading;
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
  protected readonly movieDetailsRuntime: Signal<string> = computed(() => {
    const runtime: number | undefined = this.movieDetails()?.runtime;
    if (!runtime) {
      return 'Unknown';
    }
    return convertRuntimeToHoursAndMinutes(runtime ?? 0);
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
  protected readonly genres: Signal<string[]> = computed(() => {
    const genresToUse: string[] = (this.mediaDetails.value()?.genres ?? []).map(
      (genre) => genre.name,
    );
    const totalGenresToUse: number = this.bp.lg() ? 2 : 1;
    return normalizeGenres(genresToUse).slice(0, totalGenresToUse);
  });
  protected readonly description: Signal<string> = computed(
    () =>
      this.movieDetails()?.overview ?? this.tvDetails()?.overview ?? 'No description available.',
  );
  protected readonly casts: Signal<CreditsCast[]> = computed(
    () =>
      this.credits
        .value()
        ?.cast?.map((c) => {
          return {
            ...c,
            profile_path: toTmdbImageUrl(c.profile_path, 'w185', ASSETS_PATHS.PLACEHOLDER_PROFILE),
          };
        })
        ?.slice(0, 5) ?? [],
  );
  protected readonly firstShowDate: Signal<string> = computed(() => {
    return this.movieDetails()?.release_date ?? this.tvDetails()?.first_air_date ?? 'Unknown';
  });
  protected readonly firstShowDateYear: Signal<string> = computed(() => {
    return getYearFromDate(this.firstShowDate())?.toString() ?? 'Unknown';
  });
  protected readonly youtubeVideos: Signal<Video[]> = computed(() => {
    const videos: Video[] = this.videos.value();

    console.debug(`Raw videos loaded for media ${this.mediaType()}/${this.mediaId()}:`, videos);

    if (videos.length === 0) {
      return [];
    }

    console.debug(
      `Loaded ${videos.length} videos for media ${this.mediaType()}/${this.mediaId()}`,
      videos,
    );

    return this.getYoutubeVideos(videos).slice(0, 5);
  });
  protected readonly watchProviderItems: Signal<WatchProviderItem[]> = computed(() => {
    const region = this.pickWatchProviderRegion(this.watchProviders.value());
    if (!region) {
      return [];
    }

    return this.toWatchProviderItems(region);
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

  private pickWatchProviderRegion(
    providers: WatchProvidersModel | undefined,
  ): WatchProviderRegion | undefined {
    const results = providers?.results;
    if (!results) {
      return undefined;
    }

    const preferredRegion = this.getPreferredRegionCode();
    if (preferredRegion && results[preferredRegion]) {
      return results[preferredRegion];
    }

    if (results['US']) {
      return results['US'];
    }

    const firstKey = Object.keys(results)[0];
    return firstKey ? results[firstKey] : undefined;
  }

  private toWatchProviderItems(region: WatchProviderRegion): WatchProviderItem[] {
    const providers = new Map<number, WatchProviderItem>();
    const link = region.link ?? '';
    const groups = [region.flatrate, region.rent, region.buy, region.ads, region.free];

    groups.forEach((group) => {
      group?.forEach((provider) => {
        if (providers.has(provider.provider_id)) {
          return;
        }

        providers.set(provider.provider_id, {
          id: provider.provider_id,
          name: provider.provider_name,
          logoUrl: toTmdbImageUrl(provider.logo_path, 'w92', '/images/placeholder.png'),
          link,
        });
      });
    });

    return [...providers.values()].sort((left, right) => left.name.localeCompare(right.name));
  }

  private getPreferredRegionCode(): string | undefined {
    const preferredLanguage = this.userSettings().preferredLanguage;
    if (!preferredLanguage) {
      return undefined;
    }

    if (preferredLanguage.includes('-')) {
      const region = preferredLanguage.split('-')[1];
      return region ? region.toUpperCase() : undefined;
    }

    const languageRegionMap: Record<string, string> = {
      en: 'US',
      ja: 'JP',
      ko: 'KR',
      zh: 'CN',
      fr: 'FR',
      es: 'ES',
      pt: 'PT',
      de: 'DE',
      it: 'IT',
      hi: 'IN',
      ar: 'SA',
      ru: 'RU',
      tr: 'TR',
      nl: 'NL',
      sv: 'SE',
      no: 'NO',
      da: 'DK',
      fi: 'FI',
      pl: 'PL',
      cs: 'CZ',
      el: 'GR',
    };

    return languageRegionMap[preferredLanguage] ?? preferredLanguage.toUpperCase();
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
      imgSrc: toTmdbImageUrl(item.poster_path),
      rating: item.vote_average,
      year: getYearFromDate(date) ?? 0,
      type: item.media_type,
      genres: toGenres(item.genre_ids),
    };
  }

  private emptySimilarMedia(): MovieSimilarModel | TvSeriesSimilarModel {
    return {} as MovieSimilarModel | TvSeriesSimilarModel;
  }

  private getYoutubeVideos(videos: Video[]): Video[] {
    return videos.filter((video) => video.site.trim().toLowerCase() === 'youtube');
  }
}
