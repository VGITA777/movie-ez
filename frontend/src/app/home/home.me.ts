import { Component, inject, Signal } from '@angular/core';
import { HeroSliderMe, HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { environment } from '@environments/environment';
import {
  MediaCarouselItem,
  MediaCarouselMe,
  MediaCarouselOutput,
} from '@shared/ui/media-carousel/media-carousel.me';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { MediaCarouselBackdropItemMe } from '@shared/ui/media-carousel/media-carousel-backdrop-item/media-carousel-backdrop-item.me';
import {
  MediaCarouselTopItem,
  MediaCarouselTopItemMe,
  TopRanking,
} from '@shared/ui/media-carousel/media-carousel-top-item/media-carousel-top-item.me';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import { MediaDiscoverService } from '@shared/services/media-discover.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { first, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import {
  DiscoverMovieModel,
  DiscoverTvModel,
  MovieShortDetailsWithMediaTypeModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
} from '@shared/models';
import { getYearFromDate, toGenres } from '@shared/utils';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { MediaListsService } from '@shared/services/media-lists.service';
import { MediaTvSeriesService } from '@shared/services/media-tv-series-series.service';
import { MediaMovieService } from '@shared/services/media-movie.service';

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
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);

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
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=0&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
    },
    {
      id: 378064,
      title: 'A Silent Voice',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/5lAMQMWpXMsirvtLLvW7cJgEPkU.jpg`,
      rating: 8.4,
      type: 'movie',
      description:
        'Shouya Ishida starts bullying the new girl in class, Shouko Nishimiya, because she is deaf. But as the teasing ' +
        'continues, the rest of the class starts to turn on Shouya for his lack of compassion. When they leave elementary ' +
        'school, Shouko and Shouya do not speak to each other again... until an older, wiser Shouya, ' +
        'tormented by his past behaviour, decides he must see Shouko once more. He wants to atone for his ' +
        'sins, but is it already too late...?',
      year: 2016,
      genres: ['Animation', 'Drama'],
      videoSrc:
        'https://www.youtube.com/embed/nfK6UgLra7g?autoplay=1&mute=0&controls=0&loop=1&disablekb=1?playlist=nfK6UgLra7g',
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
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=0&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      genres: ['Action', 'Crime'],
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
  protected readonly popularMovies: Signal<MediaCarouselItem[]> = toSignal(
    this.mediaListService.getMoviePopular().pipe(
      first(),
      map((movies) => movies.results),
      switchMap((movieShow) => {
        const requests = movieShow.map((movieShow) => {
          return this.mediaMovieService.getMovieImages(movieShow.id).pipe(
            first(),
            map((e) => e.backdrops),
            mergeMap((backdrops) => {
              const backdrop =
                backdrops.find((backdrop) => backdrop.vote_average > 0) ?? backdrops[0];
              if (backdrop) {
                movieShow.backdrop_path = backdrop.file_path;
              }
              return of(movieShow);
            }),
          );
        });
        return forkJoin(requests);
      }),
      map((movies) => {
        return movies.map((movie) => {
          return this.convertToCarouselItem(movie, 'backdrop');
        });
      }),
    ),
    {
      initialValue: [],
    },
  );
  protected readonly popularTvShows: Signal<MediaCarouselItem[]> = toSignal(
    this.mediaListService.getTvSeriesPopular().pipe(
      first(),
      map((tvShows) => tvShows.results),
      switchMap((tvShow) => {
        const requests = tvShow.map((tvShow) => {
          return this.mediaTvSeriesService.getTvSeriesImages(tvShow.id).pipe(
            first(),
            map((e) => e.backdrops),
            mergeMap((backdrops) => {
              const backdrop =
                backdrops.find((backdrop) => backdrop.vote_average > 0) ?? backdrops[0];
              if (backdrop) {
                tvShow.backdrop_path = backdrop.file_path;
              }
              return of(tvShow);
            }),
          );
        });
        return forkJoin(requests);
      }),
      map((tvShows) => {
        return tvShows.map((tvShow) => {
          return this.convertToCarouselItem(tvShow, 'backdrop');
        });
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
    imgToUse: 'poster' | 'backdrop' = 'poster',
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
    const imgPath: string = imgToUse === 'poster' ? item.poster_path : item.backdrop_path;
    return {
      id: item.id,
      title: title,
      type: item.media_type,
      genres: toGenres(item.genre_ids),
      imgSrc: `${environment.tmdb.imageBaseUrl}original${imgPath}`,
      rating: item.vote_average,
      videoSrc: '',
      year: year,
    };
  }
}
