import { Component, inject, Signal } from '@angular/core';
import { HeroSliderMe, HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { environment } from '@environments/environment';
import {
  MediaCarouselItem,
  MediaCarouselMe,
  MediaCarouselOutput,
} from '@shared/ui/media-carousel/media-carousel.me';
import {
  DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES,
  MediaCarouselCoverItemMe,
} from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import {
  DEFAULT_MEDIA_CAROUSEL_BACKDROP_ITEM_STYLES,
  MediaCarouselBackdropItemMe,
} from '@shared/ui/media-carousel/media-carousel-backdrop-item/media-carousel-backdrop-item.me';
import {
  DEFAULT_MEDIA_CAROUSEL_TOP_ITEM_STYLES,
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
  EMPTY,
  filter,
  first,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  toArray,
} from 'rxjs';
import {
  DiscoverMovieModel,
  DiscoverTvModel,
  ImagesModel,
  isSearchableMediaType,
  MediaType,
  MovieDetailsModel,
  MovieShortDetailsWithMediaTypeModel,
  OfflinePlaylist,
  SearchableMediaType,
  TvSeriesDetailsModel,
  TvSeriesShortDetailsModelWithMediaTypeModel,
  Video,
  VideosModel,
} from '@shared/models';
import { getYearFromDate, loadFile, pickYoutubeTrailerFromArray, toGenres } from '@shared/utils';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { MediaListsService } from '@shared/services/media/media-lists.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series.service';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { CuratedContents } from '@shared/shared-types';
import { YoutubeEmbedService } from '@shared/services/media/youtube-embed-service';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { NgTemplateOutlet } from '@angular/common';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { NgxHaloComponent } from '@omnedia/ngx-halo';
import { MAX_CONCURRENT_REQUESTS } from '@shared/constants';

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

type PlaylistMediaItem = MediaCarouselItem & { backdropImg: string };

type PlaylistDisplayMode = 'cover' | 'backdrop';

type PlaylistMedia = {
  id: string;
  name: string;
  displayMode: PlaylistDisplayMode;
  items: MediaCarouselItem[];
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
    NgxHaloComponent,
  ],
  templateUrl: './home.me.html',
  styleUrl: './home.me.css',
})
export class HomeMe {
  private readonly MAX_CONCURRENT_PLAYLISTS: number = 2;
  private readonly MAX_CONCURRENT_PLAYLIST_ITEMS: number = 3;
  private readonly discoverService: MediaDiscoverService = inject(MediaDiscoverService);
  private readonly mediaListService: MediaListsService = inject(MediaListsService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly youtubeEmbedService: YoutubeEmbedService = inject(YoutubeEmbedService);
  private readonly navFacade: NavigationFacade = inject(NavigationFacade);
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly userLocalPlaylist: UserLocalPlaylistService = inject(UserLocalPlaylistService);
  private readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylist.playlists;

  protected readonly DEFAULT_MEDIA_CAROUSEL_TOP_ITEM_STYLES: string =
    DEFAULT_MEDIA_CAROUSEL_TOP_ITEM_STYLES;
  protected readonly DEFAULT_MEDIA_CAROUSEL_BACKDROP_ITEM_STYLES: string =
    DEFAULT_MEDIA_CAROUSEL_BACKDROP_ITEM_STYLES;
  protected readonly DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES: string =
    DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES;
  protected readonly carouselSkeletonItems: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  protected readonly heroSkeletonItems: number[] = [1];
  protected readonly isAuthenticated: Signal<boolean> = this.authFacade.isAuthenticated;
  protected readonly heroItems: Signal<HomeHeroSliderItem[]> = this.toArraySignal(
    from(loadFile<CuratedContents>('/configs/curated-contents.json')).pipe(
      map((contents) => contents.homeHeroSlider),
      switchMap((entries): Observable<HomeHeroSliderItem[]> => {
        return from(entries).pipe(
          filter((entry) => isSearchableMediaType(entry.mediaType)),
          mergeMap(
            ({ id, mediaType }) =>
              this.getHeroSliderItem(mediaType as HomeSupportedMediaType, id).pipe(
                first(),
                catchError(() => {
                  console.debug(
                    `Failed to load hero slider item for ${mediaType}/${id}, skipping...`,
                  );
                  return EMPTY;
                }),
              ),
            MAX_CONCURRENT_REQUESTS,
          ),
          toArray(),
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
  protected readonly userPlaylistsFullDetails: Signal<PlaylistMedia[]> = toSignal(
    toObservable(this.playlists).pipe(
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
      switchMap((playlists) => {
        if (playlists.length === 0) {
          return of([]);
        }

        return from(playlists).pipe(
          mergeMap((playlist, playlistIndex): Observable<PlaylistMedia> => {
            return from(playlist.items).pipe(
              filter((media) => {
                const trackId: number = Number.parseInt(media.trackId.trim(), 10);
                return !Number.isNaN(trackId) && isSearchableMediaType(media.mediaType);
              }),
              mergeMap((media): Observable<PlaylistMediaItem | null> => {
                const mediaType: SearchableMediaType = media.mediaType as SearchableMediaType;
                const trackId: number = Number.parseInt(media.trackId.trim(), 10);

                const details$ = this.getDetails(mediaType, trackId).pipe(
                  first(),
                  catchError((error) => {
                    console.error(
                      `Failed to load details for playlist item: ${media.mediaType}/${media.trackId}`,
                      error,
                    );
                    return of(null);
                  }),
                );

                const images$ = this.getImages(mediaType, trackId).pipe(
                  first(),
                  catchError((error) => {
                    console.error(
                      `Failed to load images for playlist item: ${media.mediaType}/${media.trackId}`,
                      error,
                    );

                    return of({ backdrops: [] } as ImagesResponse);
                  }),
                );

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
                  images: images$,
                  videos: videos$,
                }).pipe(
                  map(({ details, videos, images }): PlaylistMediaItem | null => {
                    if (!details) {
                      return null;
                    }

                    const item: MovieDetailsModel | TvSeriesDetailsModel = details;
                    const videoResults: Video[] = videos.results;

                    const backdropPath: string =
                      this.getBestBackdropPath(images.backdrops) ??
                      images.backdrops[0]?.file_path ??
                      item.backdrop_path ??
                      '';

                    const videoSrc: string | undefined = this.getYoutubeEmbedTrailer(videoResults);

                    const mediaCarouselItem = this.toMediaCarouselItem({
                      item,
                      mediaType,
                      videoSrc,
                    });

                    const backdropImg: string = `${environment.tmdb.imageBaseUrl}original${backdropPath}`;

                    return {
                      ...mediaCarouselItem,
                      backdropImg,
                    };
                  }),
                );
              }, this.MAX_CONCURRENT_PLAYLIST_ITEMS),
              filter((item): item is PlaylistMediaItem => item !== null),
              toArray(),
              map((mediaCarouselItems: PlaylistMediaItem[]): PlaylistMedia => {
                const displayMode: PlaylistDisplayMode =
                  playlistIndex % 2 === 0 ? 'cover' : 'backdrop';
                const items = mediaCarouselItems.map((item) => {
                  if (displayMode === 'cover') {
                    return {
                      ...item,
                      imgSrc: item.imgSrc, // use poster image
                    };
                  } else {
                    return {
                      ...item,
                      imgSrc: item.backdropImg, // use backdrop image
                    };
                  }
                });

                return {
                  id: playlist.id,
                  name: playlist.name,
                  displayMode: displayMode,
                  items: items,
                };
              }),
            );
          }, this.MAX_CONCURRENT_PLAYLISTS),

          toArray(),
        );
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

  private getVideos(mediaType: HomeSupportedMediaType, id: number): Observable<VideosModel> {
    return mediaType === MediaType.MOVIE
      ? this.mediaMovieService.getMovieVideos(id)
      : this.mediaTvSeriesService.getTvSeriesVideos(id);
  }

  private getImages(mediaType: HomeSupportedMediaType, id: number): Observable<ImagesModel> {
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

  private toMediaCarouselItem(input: {
    item: MovieDetailsModel | TvSeriesDetailsModel;
    mediaType: HomeSupportedMediaType;
    imgSrc?: string;
    videoSrc?: string;
  }): MediaCarouselItem {
    const { item, mediaType, imgSrc, videoSrc } = input;

    const title: string =
      mediaType === MediaType.MOVIE
        ? (item as MovieDetailsModel).title
        : (item as TvSeriesDetailsModel).name;

    const date: string =
      mediaType === MediaType.MOVIE
        ? (item as MovieDetailsModel).release_date
        : (item as TvSeriesDetailsModel).first_air_date;

    const imgPath: string | null | undefined = imgSrc ?? item.poster_path;

    return {
      id: item.id,
      title,
      type: mediaType,
      genres: toGenres(item.genres.map((genre) => genre.id)),
      imgSrc: imgPath ? `${environment.tmdb.imageBaseUrl}original${imgPath}` : '',
      rating: item.vote_average,
      videoSrc: videoSrc ?? '',
      year: getYearFromDate(date) ?? 0,
    };
  }
}
