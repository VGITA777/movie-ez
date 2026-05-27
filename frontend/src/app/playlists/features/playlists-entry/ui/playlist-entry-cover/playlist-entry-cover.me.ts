import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ASSETS_PATHS } from '@shared/constants';

@Component({
  selector: 'me-playlist-entry-cover',
  imports: [NgOptimizedImage],
  templateUrl: './playlist-entry-cover.me.html',
  styleUrl: './playlist-entry-cover.me.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistEntryCoverMe {
  public readonly images: InputSignal<string[]> = input.required<string[]>();

  protected readonly singleImage: Signal<string> = computed(() => {
    return this.images()?.[0] ?? '/images/placeholder.png';
  });

  protected readonly multipleImages: Signal<string[]> = computed(() => {
    return (
      this.images()
        ?.filter((url) => !!url)
        .slice(0, 4) ?? []
    );
  });
  protected placeholderEmptyPlaylist: string = ASSETS_PATHS.PLACEHOLDER_EMPTY_PLAYLIST;
}
