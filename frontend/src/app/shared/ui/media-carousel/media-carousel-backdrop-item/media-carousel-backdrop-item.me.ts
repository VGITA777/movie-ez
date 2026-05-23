import { Component } from '@angular/core';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideClock, lucideStar } from '@ng-icons/lucide';
import { InteractiveMediaCardMe } from '@shared/ui/interactive-media-card/interactive-media-card.me';
import { convertRuntimeToHoursAndMinutes } from '@shared/utils';
import { MediaCarouselItemBase } from '@shared/ui/media-carousel/media-carousel-item.base';

export interface MediaCarouselBackdropItem extends MediaCarouselItem {
  readonly runtime: number;
}

export const DEFAULT_MEDIA_CAROUSEL_BACKDROP_ITEM_STYLES: string =
  'aspect-video basis-[325px] md:basis-[375px] lg:basis-[425px]';

@Component({
  selector: 'me-media-carousel-backdrop-item',
  imports: [HlmIconImports, InteractiveMediaCardMe],
  templateUrl: './media-carousel-backdrop-item.me.html',
  styleUrl: './media-carousel-backdrop-item.me.css',
  providers: [provideIcons({ lucideClock, lucideStar })],
})
export class MediaCarouselBackdropItemMe extends MediaCarouselItemBase<MediaCarouselBackdropItem> {
  protected readonly convertRuntimeToHoursAndMinutes = convertRuntimeToHoursAndMinutes;
}
