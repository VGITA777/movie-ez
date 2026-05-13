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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  defaultIfEmpty,
  first,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import {
  DiscoverMovieModel,
  DiscoverTvModel,
  isSearchableMediaType,
  MediaType,
  MovieDetailsModel,
  MovieShortDetailsWithMediaTypeModel,
  OfflinePlaylist,
  SearchableMediaType,
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

type HomeSupportedMediaType = SearchableMediaType;

type CarouselSourceItem =
  | DiscoverMovieModel
  | DiscoverTvModel
  | MovieShortDetailsWithMediaTypeModel
  | TvSeriesShortDetailsModelWithMediaTypeModel;

type ListResponse<T> = {
  results: T[];
};

type VideoResponse = {
  results: Video[];
};

type BackdropImage = {
  file_path: string;
  vote_average: number;
};

type ImagesResponse = {
  backdrops: BackdropImage[];
};

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

  protected readonly heroItems: Signal<HomeHeroSliderItem[]> = this.toArraySignal(
    from(loadFile<CuratedContents>('/configs/curated-contents.json')).pipe(
      map((contents) => contents.homeHeroSlider),
      switchMap((entries): Observable<HomeHeroSliderItem[]> => {
        const requests$ = entries
          .filter((entry): entry is typeof entry & { mediaType: HomeSupportedMediaType } => {
            return isSearchableMediaType(entry.mediaType);
          })
          .map((entry) => {
            return this.getHeroSliderItem(entry.mediaType, entry.id).pipe(
              catchError((error) => {
                console.error(
                  `Failed to load curated hero item: ${entry.mediaType}/${entry.id}`,
                  error,
                );

                return of(null);
              }),
            );
          });

        return this.joinOrEmpty(requests$).pipe(
          map((items) => {
            return items.filter((item): item is HomeHeroSliderItem => item !== null);
          }),
        );
      }),
    ),
    'hero items',
  );

  protected readonly discoverMovies: Signal<MediaCarouselItem[]> = this.toArraySignal(
    this.toCarouselItems(this.discoverService.discoverMovies({ page: 1 })),
    'discover movies',
  );

  protected readonly discoverTvShows: Signal<MediaCarouselItem[]> = this.toArraySignal(
    this.toCarouselItems(this.discoverService.discoverTvShows({ page: 1 })),
    'discover TV shows',
  );

  protected readonly topMovies: Signal<MediaCarouselTopItem[]> = this.toArraySignal(
    this.toTopRankingItems(this.mediaListService.getMovieTopRated()),
    'top movies',
  );

  protected readonly topTvShows: Signal<MediaCarouselTopItem[]> = this.toArraySignal(
    this.toTopRankingItems(this.mediaListService.getTvSeriesTopRated()),
    'top TV shows',
  );

  protected readonly popularMovies: Signal<MediaCarouselItem[]> = this.toArraySignal(
    this.toPopularBackdropItems(this.mediaListService.getMoviePopular(), MediaType.MOVIE),
    'popular movies',
  );

  protected readonly popularTvShows: Signal<MediaCarouselItem[]> = this.toArraySignal(
    this.toPopularBackdropItems(this.mediaListService.getTvSeriesPopular(), MediaType.TV),
    'popular TV shows',
  );

  protected readonly userPlaylistsFullDetails: Signal<
    { id: string; name: string; items: MediaCarouselItem[] }[]
  > = toSignal(
    toObservable(this.playlists).pipe(
      // Remove unnecessary properties and filter out empty playlists.
      map((playlists: OfflinePlaylist[]) => {
        return playlists
          .map((playlist) => {
            return {
              id: playlist.id,
              name: playlist.name,
              items: playlist.items,
            };
          })
          .filter((playlist) => playlist.items.length > 0);
      }),
      // Request for details the videos for each playlist item.
      switchMap((playlists) => {
        const playlistItemsRequests$ = playlists.map((playlist) => {
          const detailVideosRequests$ = playlist.items.map((media) => {
            const mediaType: SearchableMediaType = media.mediaType as SearchableMediaType;
            const trackId: number = Number.parseInt(media.trackId.trim(), 10);

            if (Number.isNaN(trackId)) {
              console.error(`Invalid track ID for playlist item: ${media.trackId}`);
              return of(null);
            }

            const details$ = this.getDetails(mediaType, trackId).pipe(
              first(),
              catchError((error) => {
                console.error(
                  `Failed to load details for playlist item: ${media.mediaType}/${media.trackId}`,
                  error,
                );
                return of({} as MovieDetailsModel | TvSeriesDetailsModel);
              }),
            );

            /* TODO: Add the get Image (To get Images that has media names on it) */

            const videos$ = this.getVideos(mediaType, trackId).pipe(
              first(),
              catchError((error) => {
                console.error(
                  `Failed to load videos for playlist item: ${media.mediaType}/${media.trackId}`,
                  error,
                );
                return of({ results: [] } as VideoResponse);
              }),
            );

            return forkJoin({
              details: details$,
              videos: videos$,
            }).pipe(
              map(({ details, videos }) => {
                const item: MovieDetailsModel | TvSeriesDetailsModel = details;
                const videoResults: Video[] = videos.results;
                return this.toHomeHeroSliderItem(mediaType, item, videoResults);
              }),
            );
          });

          return forkJoin(detailVideosRequests$).pipe(
            map((items) => {
              return items.filter((item): item is HomeHeroSliderItem => item !== null);
            }),
            map((items) => {
              return {
                id: playlist.id,
                name: playlist.name,
                items: items,
              };
            }),
          );
        });

        return forkJoin(playlistItemsRequests$);
      }),
    ),
    { initialValue: [] },
  );

  protected handleItemClick(event: MediaCarouselOutput | HomeHeroSliderItem): void {
    this.navFacade.navigateToWatchPage({
      mediaId: event.id,
      mediaType: event.type,
    });
  }

  private toArraySignal<T>(source$: Observable<T[]>, context: string): Signal<T[]> {
    return toSignal(
      source$.pipe(
        defaultIfEmpty([]),
        catchError((error) => {
          console.error(`Failed to load ${context}:`, error);
          return of([]);
        }),
      ),
      { initialValue: [] },
    );
  }

  private joinOrEmpty<T>(requests$: Observable<T>[]): Observable<T[]> {
    if (requests$.length === 0) {
      return of([]);
    }

    return forkJoin(requests$).pipe(defaultIfEmpty([]));
  }

  private toCarouselItems<T extends CarouselSourceItem>(
    request$: Observable<ListResponse<T>>,
  ): Observable<MediaCarouselItem[]> {
    return request$.pipe(
      take(1),
      map((response) => {
        return response.results.map((item) => this.convertToCarouselItem(item));
      }),
    );
  }

  private toTopRankingItems<T extends CarouselSourceItem>(
    request$: Observable<ListResponse<T>>,
  ): Observable<MediaCarouselTopItem[]> {
    return request$.pipe(
      take(1),
      map((response) => {
        return response.results.slice(0, 10).map((item, index): MediaCarouselTopItem => {
          return {
            ...this.convertToCarouselItem(item),
            ranking: (index + 1) as TopRanking,
          };
        });
      }),
    );
  }

  private toPopularBackdropItems<T extends CarouselSourceItem>(
    request$: Observable<ListResponse<T>>,
    mediaType: HomeSupportedMediaType,
  ): Observable<MediaCarouselItem[]> {
    return request$.pipe(
      take(1),
      map((response) => response.results),
      switchMap((items) => {
        const requests$ = items.map((item) => {
          return this.toPopularBackdropItem(item, mediaType).pipe(
            catchError((error) => {
              console.error(`Failed to load popular ${mediaType} item: ${item.id}`, error);
              return of(null);
            }),
          );
        });

        return this.joinOrEmpty(requests$).pipe(
          map((items) => {
            return items.filter((item): item is MediaCarouselItem => item !== null);
          }),
        );
      }),
    );
  }

  private toPopularBackdropItem<T extends CarouselSourceItem>(
    item: T,
    mediaType: HomeSupportedMediaType,
  ): Observable<MediaCarouselItem> {
    return forkJoin({
      images: this.getImages(mediaType, item.id).pipe(
        take(1),
        catchError((error) => {
          console.error(`Failed to load images for ${mediaType}/${item.id}:`, error);
          return of({ backdrops: [] });
        }),
      ),

      videos: this.getVideos(mediaType, item.id).pipe(
        take(1),
        catchError((error) => {
          console.error(`Failed to load videos for ${mediaType}/${item.id}:`, error);
          return of({ results: [] });
        }),
      ),
    }).pipe(
      map(({ images, videos }) => {
        const backdropPath = this.getBestBackdropPath(images.backdrops) ?? item.backdrop_path;

        return this.convertToCarouselItem(
          {
            ...item,
            backdrop_path: backdropPath,
            videoSrc: this.getYoutubeEmbedTrailer(videos.results),
          },
          'backdrop',
        );
      }),
    );
  }

  private getHeroSliderItem(
    mediaType: HomeSupportedMediaType,
    id: number,
  ): Observable<HomeHeroSliderItem> {
    return forkJoin({
      details: this.getDetails(mediaType, id).pipe(take(1)),
      videos: this.getVideos(mediaType, id).pipe(
        take(1),
        catchError((error) => {
          console.error(`Failed to load hero videos for ${mediaType}/${id}:`, error);
          return of({ results: [] });
        }),
      ),
    }).pipe(
      map(({ details, videos }) => {
        return this.toHomeHeroSliderItem(mediaType, details, videos.results);
      }),
    );
  }

  private getDetails(
    mediaType: HomeSupportedMediaType,
    id: number,
  ): Observable<MovieDetailsModel | TvSeriesDetailsModel> {
    return mediaType === MediaType.MOVIE
      ? this.mediaMovieService.getMovieDetails(id)
      : this.mediaTvSeriesService.getTvSeriesDetails(id);
  }

  private getVideos(mediaType: HomeSupportedMediaType, id: number): Observable<VideoResponse> {
    return mediaType === MediaType.MOVIE
      ? this.mediaMovieService.getMovieVideos(id)
      : this.mediaTvSeriesService.getTvSeriesVideos(id);
  }

  private getImages(mediaType: HomeSupportedMediaType, id: number): Observable<ImagesResponse> {
    return mediaType === MediaType.MOVIE
      ? this.mediaMovieService.getMovieImages(id)
      : this.mediaTvSeriesService.getTvSeriesImages(id);
  }

  private getBestBackdropPath(backdrops: BackdropImage[]): string | undefined {
    return (
      backdrops.find((backdrop) => backdrop.vote_average > 0)?.file_path ?? backdrops[0]?.file_path
    );
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
    item: CarouselSourceItem & {
      videoSrc?: string;
    },
    imgToUse: 'poster' | 'backdrop' = 'poster',
  ): MediaCarouselItem {
    const isMovie = item.media_type === MediaType.MOVIE;

    const title: string = isMovie
      ? (item as MovieShortDetailsWithMediaTypeModel).title
      : (item as TvSeriesShortDetailsModelWithMediaTypeModel).name;

    const date: string = isMovie
      ? (item as MovieShortDetailsWithMediaTypeModel).release_date
      : (item as TvSeriesShortDetailsModelWithMediaTypeModel).first_air_date;

    const imgPath: string | null | undefined =
      imgToUse === 'poster' ? item.poster_path : item.backdrop_path;

    return {
      id: item.id,
      title,
      type: item.media_type,
      genres: toGenres(item.genre_ids),
      imgSrc: imgPath ? `${environment.tmdb.imageBaseUrl}original${imgPath}` : '',
      rating: item.vote_average,
      videoSrc: item.videoSrc ?? '',
      year: getYearFromDate(date) ?? 0,
    };
  }

  private toHomeHeroSliderItem(
    mediaType: HomeSupportedMediaType,
    item: MovieDetailsModel | TvSeriesDetailsModel,
    videos: Video[],
  ): HomeHeroSliderItem {
    const isMovie = mediaType === MediaType.MOVIE;

    const title: string = isMovie
      ? (item as MovieDetailsModel).title
      : (item as TvSeriesDetailsModel).name;

    const date: string = isMovie
      ? (item as MovieDetailsModel).release_date
      : (item as TvSeriesDetailsModel).first_air_date;

    const backdropPath: string | null | undefined = item.backdrop_path;

    return {
      description: item.overview,
      genres: toGenres(item.genres.map((genre) => genre.id)),
      id: item.id,
      imgSrc: backdropPath ? `${environment.tmdb.imageBaseUrl}original${backdropPath}` : '',
      rating: item.vote_average,
      title,
      type: mediaType,
      videoSrc: this.getYoutubeEmbedTrailer(videos),
      year: getYearFromDate(date) ?? 0,
    };
  }
}
