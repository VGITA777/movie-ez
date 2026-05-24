import {
  ChangeDetectionStrategy,
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
import { MediaTvSeriesService } from '@shared/services/media/media-tv-series.service';
import { first, map, Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoinOrEmpty, getUpdateLabel } from '@shared/utils';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { toast } from '@spartan-ng/brain/sonner';
import { DEFAULT_PLAYLIST_CONFIG, MAX_PLAYLIST_NAME_LENGTH } from '@shared/constants';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import { PlaylistEntryCoverMe } from './ui/playlist-entry-cover/playlist-entry-cover.me';
import { environment } from '@environments/environment';

type PlaylistItemWithImagesAndDetails = OfflinePlaylistContent & {
  images: ImagesModel;
};

@Component({
  selector: 'me-playlists-entry',
  imports: [
    PlaylistEntryCoverMe,
    HlmButtonImports,
    HlmIconImports,
    HlmDropdownMenuImports,
    HlmAlertDialogImports,
    HlmDialogImports,
    HlmInputImports,
  ],
  templateUrl: './playlists-entry.me.html',
  styleUrl: './playlists-entry.me.css',
  providers: [provideIcons({ lucideEllipsisVertical })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistsEntryMe {
  private readonly navigationFacade: NavigationFacade = inject(NavigationFacade);
  private readonly mediaMovieService: MediaMovieService = inject(MediaMovieService);
  private readonly mediaTvSeriesService: MediaTvSeriesService = inject(MediaTvSeriesService);
  private readonly localPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);

  protected readonly images: ResourceRef<PlaylistItemWithImagesAndDetails[]> = rxResource({
    defaultValue: [],
    params: (): OfflinePlaylistContent[] => this.playlist().items,
    stream: (data): Observable<PlaylistItemWithImagesAndDetails[]> => {
      const requests$ = data.params
        .slice(0, 5) // Limit to first 5 items.
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

      return forkJoinOrEmpty(requests$);
    },
  });
  protected readonly coverImages: Signal<string[]> = computed(() => {
    return (
      this.images
        .value()
        ?.map((item) => this.resolveCoverImageUrl(item.images))
        .filter((url): url is string => url !== null) ?? []
    );
  });
  protected readonly lastModificationLabel: Signal<string> = computed(() => {
    const timestamp = this.playlist().lastEditTimestamp;
    return getUpdateLabel(timestamp);
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

  protected deletePlaylist(): void {
    this.localPlaylistService.deletePlaylist(this.playlist().id);
  }

  protected updatePlaylistName(value: string, ctx: any) {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      toast.info('Playlist name cannot be empty.', DEFAULT_PLAYLIST_CONFIG);
      return;
    }

    if (trimmedValue.length > MAX_PLAYLIST_NAME_LENGTH) {
      toast.info(
        `Playlist name cannot exceed ${MAX_PLAYLIST_NAME_LENGTH} characters.`,
        DEFAULT_PLAYLIST_CONFIG,
      );
      return;
    }
    this.localPlaylistService.renamePlaylist(this.playlist().id, trimmedValue);
    ctx.close();
  }

  protected navigateToPlaylistPage(): void {
    this.navigationFacade.navigateToPlaylistPage(this.playlist().id);
  }

  private getMediaImages(trackId: number, mediaType: SearchableMediaType): Observable<ImagesModel> {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.mediaMovieService.getMovieImages(trackId);
      case MediaType.TV:
        return this.mediaTvSeriesService.getTvSeriesImages(trackId);
    }
  }

  private resolveCoverImageUrl(images: ImagesModel): string | null {
    const poster = images.posters.find((item) => !!item.file_path);

    if (poster?.file_path) {
      return this.getTmdbImageUrl(poster.file_path);
    }

    const backdrop = images.backdrops.find((item) => !!item.file_path);

    return backdrop?.file_path ? this.getTmdbImageUrl(backdrop.file_path) : null;
  }

  private getTmdbImageUrl(filePath: string, size: string = 'original'): string {
    return `${environment.tmdb.imageBaseUrl}${size}${filePath}`;
  }
}
