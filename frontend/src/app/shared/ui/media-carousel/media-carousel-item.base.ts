import { computed, Directive, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { normalizeGenres } from '@shared/utils';

/**
 * Base class for all media carousel item components.
 *
 * Shared responsibilities:
 * - exposes the carousel item input
 * - exposes the item click output
 * - normalizes genres so values like "Action & Adventure"
 *   become ["Action", "Adventure"]
 *
 * This prevents each carousel item component from needing to implement
 * its own genre normalization logic.
 */
@Directive()
export abstract class MediaCarouselItemBase<TItem extends MediaCarouselItem = MediaCarouselItem> {
  public readonly item: InputSignal<TItem> = input.required<TItem>();
  public readonly itemClick: OutputEmitterRef<TItem> = output<TItem>();

  protected readonly genres: Signal<string[]> = computed(() => {
    return normalizeGenres(this.item().genres);
  });

  /**
   * Useful for cover/top cards where only one genre should be shown.
   */
  protected readonly primaryGenres: Signal<string[]> = computed(() => {
    return this.genres().slice(0, 1);
  });

  /**
   * Useful for wider backdrop cards where two genres can fit.
   */
  protected readonly secondaryGenres: Signal<string[]> = computed(() => {
    return this.genres().slice(0, 2);
  });
}
