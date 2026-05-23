import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgOptimizedImage } from '@angular/common';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { lucideStar } from '@ng-icons/lucide';
import { MediaCarouselItemBase } from '@shared/ui/media-carousel/media-carousel-item.base';

export type TopRanking = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const DEFAULT_MEDIA_CAROUSEL_TOP_ITEM_STYLES: string =
  'ml-12 aspect-[2/3] basis-[225px] md:basis-[250px] lg:basis-[275px]';

export interface MediaCarouselTopItem extends MediaCarouselItem {
  readonly ranking: TopRanking;
}

@Component({
  selector: 'me-media-carousel-top-item',
  imports: [NgIcon, NgOptimizedImage],
  templateUrl: './media-carousel-top-item.me.html',
  styleUrl: './media-carousel-top-item.me.css',
  providers: [provideIcons({ lucideStar })],
})
export class MediaCarouselTopItemMe extends MediaCarouselItemBase<MediaCarouselTopItem> {}
