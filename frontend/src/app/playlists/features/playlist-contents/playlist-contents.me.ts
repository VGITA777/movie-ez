import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import {
  MediaType,
  MovieDetailsModel,
  OfflinePlaylist,
  SortingOptionEntry,
  StoredSortingOption,
  TvSeriesDetailsModel,
} from '@shared/models';
import { getUpdateLabel, getYearFromDate, toGenres, toTmdbImageUrl } from '@shared/utils';
import { breakpoints, params, storage } from '@signality/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  filter,
  finalize,
  first,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series-series.service';
import {
  MAX_CONCURRENT_REQUESTS,
  PLAYLIST_CONTENTS_SORT_OPTION_STORAGE_KEY,
} from '@shared/constants';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { PlaylistEntryCoverMe } from '@playlists/features/playlists-entry/ui/playlist-entry-cover/playlist-entry-cover.me';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
  lucideArrowDownWideNarrow,
  lucideArrowUpDown,
  lucideArrowUpNarrowWide,
  lucideBookmark,
  lucideCloudSync,
  lucideRefreshCw,
} from '@ng-icons/lucide';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import { NgxAuroraComponent } from '@omnedia/ngx-aurora';
import { UserPlaylistManagerService } from '@shared/services/user/user-playlist-manager.service';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { DEFAULT_BREAKPOINTS } from '@shared/shared-types';
import { NgTemplateOutlet } from '@angular/common';
import { ShowPlaylistsDirective } from '@shared/directives/show-playlists-directive';
import { HlmIconImports } from '@spartan-ng/helm/icon';

export interface PlaylistContentsRouteParams {
  readonly playlistId: string;
}

type SortingOption = 'title' | 'release_year' | 'rating' | 'date_added';
type SharedMediaDetails = MediaCarouselItem & { addedOn: string };
type DetailsWithDateAdded =
  | (MovieDetailsModel & { addedOn: string })
  | (TvSeriesDetailsModel & { addedOn: string });

const SORTING_OPTIONS: SortingOptionEntry<SortingOption>[] = [
  { label: 'Date Added', value: 'date_added' },
  { label: 'Title', value: 'title' },
  { label: 'Rating', value: 'rating' },
  { label: 'Release Year', value: 'release_year' },
];

const SORTING_OPTIONS_MAP: Record<
  SortingOption,
  SortingOptionEntry<SortingOption>
> = Object.fromEntries(SORTING_OPTIONS.map((option) => [option.value, option])) as Record<
  SortingOption,
  SortingOptionEntry<SortingOption>
>;

const DEFAULT_STORED_SORTING_OPTION: StoredSortingOption<SortingOption> = {
  sortingOption: 'date_added',
  direction: 'asc',
};

@Component({
  selector: 'me-playlist',
  imports: [
    HlmSeparatorImports,
    MediaCarouselCoverItemMe,
    PlaylistEntryCoverMe,
    HlmButtonGroupImports,
    HlmButtonImports,
    NgIcon,
    HlmDropdownMenuImports,
    NgxAuroraComponent,
    HlmTooltip,
    NgTemplateOutlet,
    ShowPlaylistsDirective,
    HlmIconImports,
  ],
  templateUrl: './playlist-contents.me.html',
  styleUrl: './playlist-contents.me.css',
  providers: [
    provideIcons({
      lucideArrowUpNarrowWide,
      lucideArrowDownWideNarrow,
      lucideArrowUpDown,
      lucideCloudSync,
      lucideRefreshCw,
      lucideBookmark,
    }),
  ],
})
export class PlaylistContentsMe {
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly navigationFacade: NavigationFacade = inject(NavigationFacade);
  private readonly userPlaylistManagerService: UserPlaylistManagerService = inject(
    UserPlaylistManagerService,
  );
  private readonly authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private readonly params: Signal<PlaylistContentsRouteParams> =
    params<PlaylistContentsRouteParams>();
  private readonly storedSortingOption: WritableSignal<StoredSortingOption<SortingOption>> =
    storage(PLAYLIST_CONTENTS_SORT_OPTION_STORAGE_KEY, DEFAULT_STORED_SORTING_OPTION);

  protected readonly sortingOptions: SortingOptionEntry<SortingOption>[] = SORTING_OPTIONS;
  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);
  protected readonly isAuthenticated: Signal<boolean> = this.authFacadeService.isAuthenticated;
  protected readonly isSyncing: Signal<boolean> = this.userPlaylistManagerService.isSyncing;
  protected readonly isPlaylistContentLoading: WritableSignal<boolean> = signal(false);
  protected readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylistService.playlists;
  protected readonly currentPlaylist: Signal<OfflinePlaylist | undefined> = computed(() => {
    const playlistId: string = this.params().playlistId;
    return this.playlists().find((playlist) => playlist.id === playlistId);
  });
  protected readonly currentPlaylistContents: Signal<SharedMediaDetails[]> = toSignal(
    toObservable(this.currentPlaylist).pipe(
      filter((playlist): playlist is OfflinePlaylist => playlist !== undefined),
      switchMap((playlist) => {
        this.isPlaylistContentLoading.set(true);
        return from(playlist.items).pipe(
          filter((item) => !Number.isNaN(parseInt(item.trackId, 10))),
          map((item) => {
            const trackId: number = parseInt(item.trackId, 10);
            return this.getMediaDetails(trackId, item.addedOn, item.mediaType);
          }),
          mergeMap((requests) => requests, MAX_CONCURRENT_REQUESTS),
          filter((details): details is DetailsWithDateAdded => details !== null),
          map((details) => this.toSharedMediaDetails(details)),
          finalize(() => this.isPlaylistContentLoading.set(false)),
          toArray(),
        );
      }),
    ),
    { initialValue: [] },
  );
  protected readonly sortedPlaylistContents: Signal<SharedMediaDetails[]> = computed(() => {
    const contents: SharedMediaDetails[] = this.currentPlaylistContents();
    const sortingOption: SortingOption = this.selectedSortingOption().value;
    const direction: 'asc' | 'desc' = this.selectedSortingDirection();

    return [...contents].sort((a, b) => {
      const comparison: number = this.comparePlaylistContent(a, b, sortingOption);
      return direction === 'asc' ? comparison : -comparison;
    });
  });
  protected readonly lastModificationLabel: Signal<string> = computed(() => {
    const timestamp: string = this.currentPlaylist()?.lastEditTimestamp ?? '';
    return getUpdateLabel(timestamp);
  });
  protected readonly coverImages: Signal<string[]> = computed(() => {
    return this.currentPlaylistContents().map((item) => toTmdbImageUrl(item.imgSrc, 'w300'));
  });
  protected readonly selectedSortingDirection: WritableSignal<'asc' | 'desc'> = linkedSignal(() => {
    return this.storedSortingOption().direction ?? DEFAULT_STORED_SORTING_OPTION.direction;
  });
  protected readonly selectedSortingOption: WritableSignal<SortingOptionEntry<SortingOption>> =
    linkedSignal(() => {
      const storedValue: SortingOption =
        this.storedSortingOption().sortingOption ?? DEFAULT_STORED_SORTING_OPTION.sortingOption;

      return SORTING_OPTIONS_MAP[storedValue] ?? SORTING_OPTIONS_MAP.date_added;
    });

  protected readonly updateSortingOption = (option: SortingOptionEntry<SortingOption>): void => {
    this.selectedSortingOption.set(option);

    this.storedSortingOption.set({
      sortingOption: option.value,
      direction: this.selectedSortingDirection(),
    });
  };
  protected playlistContentSkeletonCount: number[] = Array.from({ length: 5 }, (_, i) => i);

  protected toggleSortingDirection() {
    this.selectedSortingDirection.update((current) => (current === 'asc' ? 'desc' : 'asc'));
  }

  protected navigateToWatchPage(item: SharedMediaDetails): void {
    this.navigationFacade.navigateToWatchPage({
      mediaId: item.id,
      mediaType: item.type,
    });
  }

  private getMediaDetails(
    trackId: number,
    addedOn: string,
    mediaType: MediaType,
  ): Observable<DetailsWithDateAdded | null> {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.mediaMovieService.getMovieDetails(trackId).pipe(
          first(),
          map((details) => ({ ...details, addedOn: addedOn })),
        );
      case MediaType.TV:
        return this.mediaTvSeriesService.getTvSeriesDetails(trackId).pipe(
          first(),
          map((details) => ({ ...details, addedOn: addedOn })),
        );
      default:
        return of(null);
    }
  }

  private toSharedMediaDetails(details: DetailsWithDateAdded): SharedMediaDetails {
    const title: string = 'title' in details ? details.title : details.name;
    const publish: string =
      'release_date' in details ? details.release_date : details.first_air_date;
    const year: number = getYearFromDate(publish) ?? 0;
    const genres: string[] = toGenres(details.genres.map((genre) => genre.id));
    return {
      rating: details.vote_average,
      id: details.id,
      title: title,
      imgSrc: toTmdbImageUrl(details.poster_path),
      type: details.media_type,
      year: year,
      genres: genres,
      addedOn: details.addedOn,
      videoSrc: undefined, // Maybe we can add a video source in the future if needed
    };
  }

  private comparePlaylistContent(
    first: SharedMediaDetails,
    second: SharedMediaDetails,
    sortOption: SortingOption,
  ): number {
    switch (sortOption) {
      case 'title':
        return first.title.localeCompare(second.title);
      case 'release_year':
        return first.year - second.year;
      case 'rating':
        return first.rating - second.rating;
      case 'date_added':
        return this.toInstantEpochMs(first.addedOn) - this.toInstantEpochMs(second.addedOn);
      default:
        return 0;
    }
  }

  private toInstantEpochMs(value: string | null | undefined): number {
    if (!value) {
      return 0;
    }

    const parsed: number = Date.parse(value);

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  protected syncPlaylists(): void {
    this.userPlaylistManagerService.sync();
  }
}
