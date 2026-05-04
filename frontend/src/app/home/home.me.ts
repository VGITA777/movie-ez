import { Component, inject, Signal } from '@angular/core';
import { HeroSliderMe, HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { environment } from '@environments/environment';
import {
  MediaCarouselItem,
  MediaCarouselMe,
  MediaCarouselOutput,
} from '@shared/ui/media-carousel/media-carousel.me';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import {
  MediaCarouselBackdropItem,
  MediaCarouselBackdropItemMe,
} from '@shared/ui/media-carousel/media-carousel-backdrop-item/media-carousel-backdrop-item.me';
import {
  MediaCarouselTopItem,
  MediaCarouselTopItemMe,
  TopRanking,
} from '@shared/ui/media-carousel/media-carousel-top-item/media-carousel-top-item.me';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import { MediaDiscoverService } from '@shared/services/media-discover.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { first, map } from 'rxjs';
import {
  DiscoverMovieModel,
  DiscoverTvModel,
  MovieShortDetailsWithMediaTypeModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
} from '@shared/models';
import { getYearFromDate, toGenres } from '@shared/utils';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { MediaListsService } from '@shared/services/media-lists.service';

@Component({
  selector: 'me-home',
  imports: [
    HeroSliderMe,
    MediaCarouselMe,
    MediaCarouselCoverItemMe,
    MediaCarouselBackdropItemMe,
    MediaCarouselTopItemMe,
    HlmSeparatorImports,
  ],
  templateUrl: './home.me.html',
  styleUrl: './home.me.css',
})
export class HomeMe {
  private readonly discoverService: MediaDiscoverService = inject(MediaDiscoverService);
  private readonly mediaListService: MediaListsService = inject(MediaListsService);

  protected readonly items: HomeHeroSliderItem[] = [
    {
      id: 157336,
      imgSrc: `${environment.tmdb.imageBaseUrl}original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg`,
      title: 'Interstellar',
      rating: 9.8,
      type: 'movie',
      description:
        'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the' +
        ' limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
      year: 2024,
      genres: ['Sci-Fi', 'Adventure'],
      videoSrc:
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
    },
    {
      id: 1290417,
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/3ooXDVaz4xHKtwe4lkmF1gNopOC.jpg`,
      rating: 6.8,
      type: 'movie',
      description:
        'When a Category 5 hurricane decimates a coastal town, the storm surge brings devastation, chaos, and' +
        ' something far more frightening onto shore: hungry sharks.',
      year: 2026,
      genres: ['Adventure', 'Drama'],
      videoSrc:
        'https://www.youtube.com/embed/hzyOsNyDkbM?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=hzyOsNyDkbM',
    },
    {
      id: 76479,
      imgSrc: `${environment.tmdb.imageBaseUrl}original/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg`,
      title: 'The Boys',
      rating: 8.4,
      type: 'tv',
      description:
        'A group of vigilantes known informally as “The Boys” set out to take down corrupt superheroes with no more than blue-collar grit and a willingness to fight dirty.',
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      genres: ['Action', 'Crime'],
    },
  ];
  protected readonly mediaItemsBackdrop: MediaCarouselBackdropItem[] = [
    {
      id: 157336,
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/rFvnZYcJzLoC2l6cTFLQRUgYSgL.jpg`,
      rating: 9.8,
      genres: ['Sci-Fi'],
      year: 2024,
      runtime: 160,
      videoSrc:
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
      type: 'movie',
    },
    {
      id: 1290417,
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/4HIJS1btE2XvKoC0nqOr91uCcHE.jpg`,
      rating: 6.8,
      genres: ['Adventure'],
      year: 2026,
      runtime: 90,
      videoSrc:
        'https://www.youtube.com/embed/hzyOsNyDkbM?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=hzyOsNyDkbM',
      type: 'movie',
    },
    {
      id: 76479,
      title: 'The Boys',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/6ZZKGi2UyYFtUIkyWAnoMZhcjpz.jpg`,
      rating: 6.8,
      genres: ['Action'],
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      type: 'tv',
      runtime: 4,
    },
  ];

  protected readonly discoverMovies: Signal<MediaCarouselItem[]> = toSignal(
    this.discoverService.discoverMovies({ page: 1 }).pipe(
      map((response) => response.results),
      map((movies: DiscoverMovieModel[]) => {
        return movies.map((movie): MediaCarouselItem => {
          return this.convertToCarouselItem(movie);
        });
      }),
    ),
    { initialValue: [] },
  );
  protected readonly discoverTvShows: Signal<MediaCarouselItem[]> = toSignal(
    this.discoverService.discoverTvShows({ page: 1 }).pipe(
      map((response) => response.results),
      map((tvShows: DiscoverTvModel[]) => {
        return tvShows.map((tvShow) => {
          return this.convertToCarouselItem(tvShow);
        });
      }),
    ),
    { initialValue: [] },
  );
  protected readonly topMovies: Signal<MediaCarouselTopItem[]> = toSignal(
    this.mediaListService.getMovieTopRated().pipe(
      first(),
      map((movies) => movies.results),
      map((movies) => {
        return movies.map((movie) => {
          return this.convertToCarouselItem(movie);
        });
      }),
      map((movies) => {
        return movies
          .map((movie: MediaCarouselItem, index: number): MediaCarouselTopItem => {
            return {
              ...movie,
              ranking: (index + 1) as TopRanking,
            };
          })
          .slice(0, 10);
      }),
    ),
    {
      initialValue: [],
    },
  );

  protected readonly topTvShows: Signal<MediaCarouselTopItem[]> = toSignal(
    this.mediaListService.getTvSeriesTopRated().pipe(
      first(),
      map((tvShows) => tvShows.results),
      map((tvShows) => {
        return tvShows.map((tvShow) => {
          return this.convertToCarouselItem(tvShow);
        });
      }),
      map((tvShows) => {
        return tvShows
          .map((tvShow: MediaCarouselItem, index: number): MediaCarouselTopItem => {
            return {
              ...tvShow,
              ranking: (index + 1) as TopRanking,
            };
          })
          .slice(0, 10);
      }),
    ),
    {
      initialValue: [],
    },
  );

  private readonly navFacade: NavigationFacade = inject(NavigationFacade);

  protected handleItemClick(event: MediaCarouselOutput): void {
    this.navFacade.navigateToWatchPage({
      mediaId: event.id,
      mediaType: event.type,
    });
  }

  private convertToCarouselItem(
    item: MovieShortDetailsWithMediaTypeModel | TvSeriesShortDetailsModelWithMediaTypeModel,
  ): MediaCarouselItem {
    const title: string =
      item.media_type === 'movie'
        ? (item as MovieShortDetailsWithMediaTypeModel).title
        : (item as TvSeriesShortDetailsModelWithMediaTypeModel).name;
    const year: number =
      getYearFromDate(
        item.media_type === 'movie'
          ? (item as MovieShortDetailsWithMediaTypeModel).release_date
          : (item as TvSeriesShortDetailsModelWithMediaTypeModel).first_air_date,
      ) ?? 0;
    return {
      id: item.id,
      title: title,
      type: item.media_type,
      genres: toGenres(item.genre_ids),
      imgSrc: `${environment.tmdb.imageBaseUrl}original${item.poster_path}`,
      rating: item.vote_average,
      videoSrc: '',
      year: year,
    };
  }
}
