import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  ResourceRef,
  Signal,
} from '@angular/core';
import {
  ImagesModel,
  MediaType,
  OfflinePlaylist,
  OfflinePlaylistContent,
  SearchableMediaType,
} from '@shared/models';
import { MediaMovieService } from '@shared/services/media/media-movie.service';
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series-series.service';
import { first, forkJoin, map, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { environment } from '@environments/environment';

type PlaylistItemWithImagesAndDetails = OfflinePlaylistContent & {
  images: ImagesModel;
};

@Component({
  selector: 'me-playlists-entry',
  imports: [NgOptimizedImage],
  templateUrl: './playlists-entry.me.html',
  styleUrl: './playlists-entry.me.css',
})
export class PlaylistsEntryMe {
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);

  protected readonly images: ResourceRef<PlaylistItemWithImagesAndDetails[]> = rxResource({
    defaultValue: [],
    params: (): OfflinePlaylistContent[] => this.playlist().items,
    stream: (data): Observable<PlaylistItemWithImagesAndDetails[]> => {
      const requests$ = data.params
        .slice(0, 4) // Limit to 4 items.
        .map((item) => {
          const trackId: number = parseInt(item.trackId, 10);
          const mediaType: SearchableMediaType = item.mediaType as SearchableMediaType;

          if (isNaN(trackId)) {
            return;
          }

          return this.getMediaImages(trackId, mediaType).pipe(
            first(),
            map(
              (images): PlaylistItemWithImagesAndDetails => ({
                ...item,
                images: images,
              }),
            ),
          );
        })
        .filter(
          (request): request is Observable<PlaylistItemWithImagesAndDetails> =>
            request !== undefined,
        );

      return forkJoin(requests$);
    },
  });
  protected readonly singleImage: Signal<string> = computed(() => {
    return (
      `${environment.tmdb.imageBaseUrl}original${this.images.value()?.[0]?.images?.posters?.[0]?.file_path}` ||
      '/images/placeholder.png'
    );
  });
  protected readonly fourImages: Signal<string[]> = computed(() => {
    const posters: string[] = this.images.value()?.map((item) => {
      if (item.images.posters.length > 0) {
        return `${environment.tmdb.imageBaseUrl}original${item.images.posters[0].file_path}`;
      }
      return '/images/placeholder.png';
    });

    // Ensure we always return an array of 4 images, filling in placeholders as needed.
    const filledPosters: string[] = posters ? [...posters] : [];
    while (filledPosters.length < 4) {
      filledPosters.push('/images/placeholder.png');
    }

    return filledPosters.slice(0, 4);
  });
  protected readonly lastModificationLabel: Signal<string> = computed(() => {
    const timestamp = this.playlist().lastEditTimestamp;
    const parsedTime = Date.parse(timestamp);

    // Fallback in case the timestamp is invalid or missing
    if (isNaN(parsedTime)) {
      return 'Unknown';
    }

    const editDate = new Date(parsedTime);
    const today = new Date();

    editDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInMs = today.getTime() - editDate.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    }

    if (diffInDays === 1) {
      return 'Yesterday';
    }

    if (diffInDays > 1 && diffInDays <= 5) {
      return `${diffInDays} Days Ago`;
    }

    return 'Long time ago';
  });
  protected readonly itemsCountLabel: Signal<string> = computed(() => {
    const count: number = this.playlist().items.length;

    if (count === 0) {
      return 'Empty';
    }

    if (count > 100) {
      return '100+ Items';
    }

    return `${count} Item${count > 1 ? 's' : ''}`;
  });

  public readonly playlist: InputSignal<OfflinePlaylist> = input.required();

  private getMediaImages(trackId: number, mediaType: SearchableMediaType): Observable<ImagesModel> {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.mediaMovieService.getMovieImages(trackId);
      case MediaType.TV:
        return this.mediaTvSeriesService.getTvSeriesImages(trackId);
    }
  }
}
