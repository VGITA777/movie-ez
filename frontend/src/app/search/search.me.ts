import {
  Component,
  computed,
  effect,
  inject,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  ResourceRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideArchiveX, lucideKeyboard, lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { environment } from '@environments/environment';
import { NgTemplateOutlet } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { MediaSearchService } from '../shared/services/media/media-search-service';
import { FormsModule } from '@angular/forms';
import { debounced } from '@signality/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, defaultIfEmpty, filter, map, Observable, of } from 'rxjs';
import {
  MovieShortDetailsWithMediaTypeModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
} from '@shared/models';
import { getYearFromDate, toGenres } from '@shared/utils';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { NavigationFacade } from '@shared/services/navigation-facade.service';

export type SearchType = 'mixed' | 'movie' | 'tv';

@Component({
  selector: 'me-search',
  imports: [
    HlmInputGroupImports,
    HlmIconImports,
    HlmToggleGroupImports,
    MediaCarouselCoverItemMe,
    NgTemplateOutlet,
    HlmButtonImports,
    HlmDialogImports,
    NgScrollbar,
    HlmScrollAreaImports,
    FormsModule,
    HlmEmptyImports,
    HlmSkeleton,
  ],
  templateUrl: './search.me.html',
  styleUrl: './search.me.css',
  providers: [provideIcons({ lucideSearch, lucideX, lucideArchiveX, lucideKeyboard })],
})
export class SearchMe {
  private readonly searchService: MediaSearchService = inject(MediaSearchService);
  private readonly navigationFacade: NavigationFacade = inject(NavigationFacade);

  protected readonly searchQuery: ModelSignal<string> = model('');
  protected readonly debouncedSearch: Signal<string> = debounced(this.searchQuery, 500);
  protected readonly selectedType: WritableSignal<SearchType> = signal<SearchType>('mixed');
  protected readonly searchedItems: ResourceRef<MediaCarouselItem[]> = rxResource({
    defaultValue: [],
    params: (): { type: SearchType; query: string } => ({
      type: this.selectedType(),
      query: this.debouncedSearch(),
    }),
    stream: ({ params }): Observable<MediaCarouselItem[]> => {
      const trimmedQuery: string = params.query.trim();

      if (trimmedQuery === '') {
        return of([]);
      }

      let request$: Observable<MediaCarouselItem[]>;

      switch (params.type) {
        case 'mixed':
          request$ = this.performMixedSearch(trimmedQuery);
          break;
        case 'movie':
          request$ = this.performMovieSearch(trimmedQuery);
          break;
        case 'tv':
          request$ = this.performTvSearch(trimmedQuery);
          break;
        default:
          request$ = of([]);
          break;
      }

      return request$.pipe(
        defaultIfEmpty([]),
        catchError((error) => {
          console.error('Search failed:', error);
          return of([]);
        }),
      );
    },
  });
  protected readonly isLoading: Signal<boolean> = computed(() => {
    return this.searchedItems.isLoading();
  });

  public onNavigateToWatchPage: OutputEmitterRef<void> = output();

  constructor() {
    effect(() => {
      console.debug(`Error In Search`, this.searchedItems.error());
    });
  }

  protected changeSelectedType(event: any | null | undefined) {
    this.selectedType.set(event as SearchType);
  }

  private performMixedSearch(query: string, page: number = 1): Observable<MediaCarouselItem[]> {
    if (query.trim() === '') {
      return of([]);
    }

    return this.searchService.searchMulti({ query, page }).pipe(
      filter((response) => response.results.length > 0),
      map((item) => item.results),
      map((items): MediaCarouselItem[] => {
        return items.map((item): MediaCarouselItem => {
          const title: string =
            item.title ?? item.name ?? item.original_title ?? item.original_name;
          const genres: string[] = toGenres(item.genre_ids);
          const year: number =
            (item.media_type === 'movie'
              ? getYearFromDate(item.release_date)
              : getYearFromDate(item.first_air_date)) ?? 0;
          return {
            id: item.id,
            title: title,
            imgSrc: `${environment.tmdb.imageBaseUrl}original${item.poster_path}`,
            rating: item.vote_average,
            genres: genres,
            year: year,
            videoSrc: '',
            type: item.media_type,
          };
        });
      }),
    );
  }

  private performMovieSearch(query: string, page: number = 1): Observable<MediaCarouselItem[]> {
    if (query.trim() === '') {
      return of([]);
    }

    return this.searchService.searchMovie({ query, page }).pipe(
      filter((response) => response.results.length > 0),
      map((item) => item.results),
      map((items: MovieShortDetailsWithMediaTypeModel[]): MediaCarouselItem[] => {
        return items.map((item): MediaCarouselItem => {
          const title: string = item.title;
          const genres: string[] = toGenres(item.genre_ids);
          const year: number = getYearFromDate(item.release_date) ?? 0;
          return {
            id: item.id,
            title: title,
            imgSrc: `${environment.tmdb.imageBaseUrl}original${item.poster_path}`,
            rating: item.vote_average,
            genres: genres,
            year: year,
            videoSrc: '',
            type: item.media_type,
          };
        });
      }),
    );
  }

  private performTvSearch(query: string, page: number = 1): Observable<MediaCarouselItem[]> {
    if (query.trim() === '') {
      return of([]);
    }

    return this.searchService.searchTvSeries({ query, page }).pipe(
      filter((response) => response.results.length > 0),
      map((item) => item.results),
      map((items: TvSeriesShortDetailsModelWithMediaTypeModel[]): MediaCarouselItem[] => {
        return items.map((item): MediaCarouselItem => {
          const title: string = item.name ?? item.original_name;
          const genres: string[] = toGenres(item.genre_ids);
          const year: number = getYearFromDate(item.first_air_date) ?? 0;
          return {
            id: item.id,
            title: title,
            imgSrc: `${environment.tmdb.imageBaseUrl}original${item.poster_path}`,
            rating: item.vote_average,
            genres: genres,
            year: year,
            videoSrc: '',
            type: item.media_type,
          };
        });
      }),
    );
  }

  protected navigateToWatchPage(item: MediaCarouselItem) {
    this.navigationFacade.navigateToWatchPage({
      mediaId: item.id,
      mediaType: item.type,
      onNavigate: () => this.onNavigateToWatchPage.emit(),
    });
  }
}
