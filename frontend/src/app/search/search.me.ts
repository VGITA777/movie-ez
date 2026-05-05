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
import { MediaSearchService } from '@shared/services/media-search-service';
import { FormsModule } from '@angular/forms';
import { debounced } from '@signality/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { filter, finalize, map, Observable, of, switchMap } from 'rxjs';
import {
  MovieShortDetailsWithMediaTypeModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
} from '@shared/models';
import { getYearFromDate, toGenres } from '@shared/utils';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';

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

  protected readonly searchQuery: ModelSignal<string> = model('');
  private readonly debouncedSearch: Signal<string> = debounced(this.searchQuery, 500);

  protected readonly selectedType: WritableSignal<SearchType> = signal<SearchType>('mixed');
  protected readonly searchedItems: ResourceRef<MediaCarouselItem[]> = rxResource({
    defaultValue: [],
    params: (): { type: SearchType; query: string } => ({
      type: this.selectedType(),
      query: this.debouncedSearch(),
    }),
    stream: ({ params }) => {
      return of(params.query).pipe(
        switchMap((query: string): Observable<MediaCarouselItem[]> => {
          const trimmedQuery: string = query.trim();

          if (trimmedQuery === '') {
            this.isLoading.set(false);
            return of([]);
          }

          this.isLoading.set(true);

          let request$: Observable<MediaCarouselItem[]> = of([]);

          if (params.type === 'mixed') {
            request$ = this.performMixedSearch(trimmedQuery);
          } else if (params.type === 'movie') {
            request$ = this.performMovieSearch(trimmedQuery);
          } else if (params.type === 'tv') {
            request$ = this.performTvSearch(trimmedQuery);
          }

          return request$.pipe(
            finalize(() => {
              this.isLoading.set(false);
            }),
          );
        }),
      );
    },
  });
  protected readonly isLoading: WritableSignal<boolean> = signal(false);

  public onCloseClick: OutputEmitterRef<void> = output();

  constructor() {
    effect(() => {
      console.debug(`Error`, this.searchedItems.error());
    });
  }

  protected changeSelectedType(event: any) {
    this.selectedType.set(event);
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
}
