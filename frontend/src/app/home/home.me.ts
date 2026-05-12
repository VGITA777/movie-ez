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
import { MediaDiscoverService } from '@shared/services/media/media-discover.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { first, forkJoin, from, map, mergeMap, of, switchMap } from 'rxjs';
import {
  DiscoverMovieModel,
  DiscoverTvModel,
  MovieDetailsModel,
  MovieShortDetailsWithMediaTypeModel,
  OfflinePlaylist,
  TvSeriesDetailsModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
  Video,
} from '@shared/models';
import { getYearFromDate, loadFile, pickYoutubeTrailerFromArray, toGenres } from '@shared/utils';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { MediaListsService } from '@shared/services/media/media-lists.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series-series.service';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { CuratedContents } from '@shared/shared-types';
import { YoutubeEmbedService } from '@shared/services/media/youtube-embed-service';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { NgTemplateOutlet } from '@angular/common';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';

@Component({
  selector: 'me-home',
  imports: [
    HeroSliderMe,
    MediaCarouselMe,
    MediaCarouselCoverItemMe,
    MediaCarouselBackdropItemMe,
    MediaCarouselTopItemMe,
    HlmSeparatorImports,
    HlmSkeleton,
    NgTemplateOutlet,
  ],
  templateUrl: './home.me.html',
  styleUrl: './home.me.css',
})
export class HomeMe {
  private readonly discoverService: MediaDiscoverService = inject(MediaDiscoverService);
  private readonly mediaListService: MediaListsService = inject(MediaListsService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly youtubeEmbedService: YoutubeEmbedService = inject(YoutubeEmbedService);
  private readonly navFacade: NavigationFacade = inject(NavigationFacade);
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly userLocalPlaylist: UserLocalPlaylistService = inject(UserLocalPlaylistService);
  private readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylist.playlists;

  protected readonly isAuthenticated: Signal<boolean> = this.authFacade.isAuthenticated;

  /* TODO: Fetch data about the user's playlist contents and show it */
  /*
  protected readonly playlistItems: Signal<{
    playlistItems: { name: string; contents: MediaCarouselItem[] }[];
  }> = toObservable(this.playlists).pipe(
    map((playlists): { name: string; contents: string[] }[] => {
      return playlists.map((item) => ({
        name: item.name,
        contents: item.items.map((c) => c.trackId),
      }));
    }),
    switchMap((playlists) => {
      const detailsRequests = playlists.map((playlists) => {
        return {
          name: playlists.name,
          contents: playlists.contents.map((contentId) => {})
        }
      })
    }),
  );*/

  protected readonly heroItems: Signal<HomeHeroSliderItem[]> = toSignal(
    from(loadFile<CuratedContents>('/configs/curated-contents.json')).pipe(
      map((contents) => contents.homeHeroSlider),
      switchMap((entries) => {
        const detailsRequests$ = entries.map((entry) => {
          return entry.mediaType === 'movie'
            ? this.mediaMovieService.getMovieDetails(entry.id).pipe(first())
            : this.mediaTvSeriesService.getTvSeriesDetails(entry.id).pipe(first());
        });

        const videosRequests$ = entries.map((entry) => {
          return entry.mediaType === 'movie'
            ? this.mediaMovieService.getMovieVideos(entry.id).pipe(first())
            : this.mediaTvSeriesService.getTvSeriesVideos(entry.id).pipe(first());
        });

        return forkJoin({
          details: forkJoin(detailsRequests$),
          videos: forkJoin(videosRequests$),
        });
      }),
      // Map to HomeHeroSliderItem
      map(({ details, videos }) => {
        return details.map((item, index): HomeHeroSliderItem => {
          const videoSrc: string | undefined = this.getYoutubeEmbedTrailer(videos[index].results);
          const title: string =
            item.media_type === 'movie'
              ? (item as MovieDetailsModel).title
              : (item as TvSeriesDetailsModel).name;
          const imgSrc: string =
            item.media_type === 'movie'
              ? (item as MovieDetailsModel).backdrop_path
              : (item as TvSeriesDetailsModel).backdrop_path;
          const year: number =
            item.media_type === 'movie'
              ? (getYearFromDate((item as MovieDetailsModel).release_date) ?? 0)
              : (getYearFromDate((item as TvSeriesDetailsModel).first_air_date) ?? 0);
          const genres: string[] = toGenres(item.genres.map((genre) => genre.id));
          return {
            description: item.overview,
            genres: genres,
            id: item.id,
            imgSrc: `${environment.tmdb.imageBaseUrl}original${imgSrc}`,
            rating: item.vote_average,
            title: title,
            type: item.media_type,
            videoSrc: videoSrc,
            year: year,
          };
        });
      }),
    ),
    { initialValue: [] },
  );

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
      // Get Details
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
      // Get Videos
      switchMap((movies) => {
        const videos$ = movies.map((movie) => {
          return this.mediaMovieService.getMovieVideos(movie.id).pipe(
            first(),
            map((videos) => ({ details: movie, videos: videos })),
          );
        });

        return forkJoin(videos$);
      }),
      // Map to MediaCarouselItem
      map((movies) => {
        return movies.map(({ details, videos }) => {
          const videoSrc: string | undefined = this.getYoutubeEmbedTrailer(videos.results);
          return this.convertToCarouselItem({ ...details, videoSrc }, 'backdrop');
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
      // Get Details
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
      // Get Videos
      switchMap((tvShows) => {
        const videos$ = tvShows.map((tvShow) => {
          return this.mediaTvSeriesService.getTvSeriesVideos(tvShow.id).pipe(
            first(),
            map((videos) => ({ details: tvShow, videos: videos })),
          );
        });
        return forkJoin(videos$);
      }),
      // Map to MediaCarouselItem
      map((tvShows) => {
        return tvShows.map(({ details, videos }) => {
          const videoSrc: string | undefined = this.getYoutubeEmbedTrailer(videos.results);
          return this.convertToCarouselItem({ ...details, videoSrc }, 'backdrop');
        });
      }),
    ),
    {
      initialValue: [],
    },
  );

  protected handleItemClick(event: MediaCarouselOutput | HomeHeroSliderItem): void {
    this.navFacade.navigateToWatchPage({
      mediaId: event.id,
      mediaType: event.type,
    });
  }

  private getYoutubeEmbedTrailer(videos: Video[]): string | undefined {
    if (!videos || videos.length === 0) {
      return undefined;
    }
    const trailer: Video | undefined = pickYoutubeTrailerFromArray(videos);
    if (trailer) {
      return this.youtubeEmbedService.getYoutubeEmbedUrl(trailer.key);
    }
    return undefined;
  }

  private convertToCarouselItem(
    item: (MovieShortDetailsWithMediaTypeModel | TvSeriesShortDetailsModelWithMediaTypeModel) & {
      videoSrc?: string;
    },
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
      videoSrc: item.videoSrc ?? '',
      year: year,
    };
  }
}
