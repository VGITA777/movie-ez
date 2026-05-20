import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import {
  MediaType,
  MovieDetailsModel,
  OfflinePlaylist,
  TvSeriesDetailsModel,
} from '@shared/models';
import { getUpdateLabel, getYearFromDate, toGenres, toTmdbImageUrl } from '@shared/utils';
import { params } from '@signality/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, first, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series-series.service';
import { PLACEHOLDER_EMPTY_PLAYLIST_PATH } from '@shared/constants';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { PlaylistEntryCoverMe } from '@playlists/features/playlists-entry/ui/playlist-entry-cover/playlist-entry-cover.me';

export interface PlaylistContentsRouteParams {
  readonly playlistId: string;
}

type SharedMediaDetails = MediaCarouselItem;

@Component({
  selector: 'me-playlist',
  imports: [HlmSeparatorImports, MediaCarouselCoverItemMe, PlaylistEntryCoverMe],
  templateUrl: './playlist-contents.me.html',
  styleUrl: './playlist-contents.me.css',
})
export class PlaylistContentsMe {
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);
  private readonly params: Signal<PlaylistContentsRouteParams> =
    params<PlaylistContentsRouteParams>();
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);

  protected readonly isPlaylistContentLoading: WritableSignal<boolean> = signal(false);
  protected readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylistService.playlists;
  protected readonly currentPlaylist: Signal<OfflinePlaylist | undefined> = computed(() => {
    const playlistId: string = this.params().playlistId;
    return this.playlists().find((playlist) => playlist.id === playlistId);
  });
  protected readonly currentPlaylistInfo: Signal<SharedMediaDetails[]> = toSignal(
    toObservable(this.currentPlaylist).pipe(
      tap(() => this.isPlaylistContentLoading.set(true)),
      filter((playlist): playlist is OfflinePlaylist => playlist !== undefined),
      switchMap((playlist) => {
        const detailsRequests$: Observable<MovieDetailsModel | TvSeriesDetailsModel>[] =
          playlist.items
            .map((item): Observable<MovieDetailsModel | TvSeriesDetailsModel | null> => {
              const trackId: number = parseInt(item.trackId, 10);

              if (isNaN(trackId)) {
                return of(null);
              }

              return this.getMediaDetails(trackId, item.mediaType);
            })
            .filter(
              (request): request is Observable<MovieDetailsModel | TvSeriesDetailsModel> =>
                request !== undefined,
            );

        return forkJoin(detailsRequests$).pipe(
          map((details) => {
            return details.map((detail) => this.toSharedMediaDetails(detail));
          }),
        );
      }),
      tap(() => this.isPlaylistContentLoading.set(false)),
    ),
    { initialValue: [] },
  );
  protected readonly currentPlaylistCover: Signal<string> = computed(() => {
    const firstItem: SharedMediaDetails = this.currentPlaylistInfo()[0];

    if (!firstItem || !firstItem.imgSrc) {
      return PLACEHOLDER_EMPTY_PLAYLIST_PATH;
    }

    return toTmdbImageUrl(firstItem.imgSrc);
  });
  protected readonly lastModificationLabel: Signal<string> = computed(() => {
    const timestamp: string = this.currentPlaylist()?.lastEditTimestamp ?? '';
    return getUpdateLabel(timestamp);
  });
  protected readonly coverImages: Signal<string[]> = computed(() => {
    return this.currentPlaylistInfo().map((item) => toTmdbImageUrl(item.imgSrc, 'w300'));
  });

  private getMediaDetails(
    trackId: number,
    mediaType: MediaType,
  ): Observable<MovieDetailsModel | TvSeriesDetailsModel | null> {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.mediaMovieService.getMovieDetails(trackId).pipe(first());
      case MediaType.TV:
        return this.mediaTvSeriesService.getTvSeriesDetails(trackId).pipe(first());
      default:
        return of(null);
    }
  }

  private toSharedMediaDetails(
    details: MovieDetailsModel | TvSeriesDetailsModel,
  ): SharedMediaDetails {
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
      videoSrc: undefined, // Maybe we can add a video source in the future if needed
    };
  }
}
