import { Component, inject, input, InputSignal, ResourceRef } from '@angular/core';
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

type PlaylistItemWithImages = OfflinePlaylistContent & {
  images: ImagesModel;
};

@Component({
  selector: 'me-playlists-entry',
  imports: [],
  templateUrl: './playlists-entry.me.html',
  styleUrl: './playlists-entry.me.css',
})
export class PlaylistsEntryMe {
  public readonly data: InputSignal<OfflinePlaylist> = input.required();

  protected readonly images: ResourceRef<PlaylistItemWithImages[]> = rxResource({
    defaultValue: [],
    params: (): OfflinePlaylistContent[] => this.data().items,
    stream: (data): Observable<PlaylistItemWithImages[]> => {
      const requests$ = data.params
        .map((item) => {
          const trackId: number = parseInt(item.trackId, 10);
          const mediaType: SearchableMediaType = item.mediaType as SearchableMediaType;

          if (isNaN(trackId)) {
            return;
          }

          return this.getMediaImages(trackId, mediaType).pipe(
            first(),
            map(
              (images): PlaylistItemWithImages => ({
                ...item,
                images: images,
              }),
            ),
          );
        })
        .filter((request): request is Observable<PlaylistItemWithImages> => request !== undefined);

      return forkJoin(requests$);
    },
  });

  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);

  private getMediaImages(trackId: number, mediaType: SearchableMediaType): Observable<ImagesModel> {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.mediaMovieService.getMovieImages(trackId);
      case MediaType.TV:
        return this.mediaTvSeriesService.getTvSeriesImages(trackId);
    }
  }
}
