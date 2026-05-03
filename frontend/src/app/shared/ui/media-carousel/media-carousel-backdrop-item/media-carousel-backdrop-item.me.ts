import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideClock } from '@ng-icons/lucide';
import { InteractiveMediaCardMe } from '@shared/ui/interactive-media-card/interactive-media-card.me';
import { convertRuntimeToHoursAndMinutes } from '@shared/utils';

export interface MediaCarouselBackdropItem extends MediaCarouselItem {
  readonly runtime: number;
}

@Component({
  selector: 'me-media-carousel-backdrop-item',
  imports: [HlmIconImports, InteractiveMediaCardMe],
  templateUrl: './media-carousel-backdrop-item.me.html',
  styleUrl: './media-carousel-backdrop-item.me.css',
  providers: [provideIcons({ lucideClock })],
})
export class MediaCarouselBackdropItemMe {
  public readonly item: InputSignal<MediaCarouselBackdropItem> = input.required();
  public readonly itemClick: OutputEmitterRef<MediaCarouselBackdropItem> = output();
  protected readonly convertRuntimeToHoursAndMinutes = convertRuntimeToHoursAndMinutes;

  constructor() {}
}
