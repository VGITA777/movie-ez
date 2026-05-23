import { Component } from '@angular/core';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideStar } from '@ng-icons/lucide';
import { MediaCarouselItemBase } from '@shared/ui/media-carousel/media-carousel-item.base';

export const DEFAULT_MEDIA_CAROUSEL_COVER_ITEM_STYLES: string =
  'aspect-[2/3] basis-[225px] md:basis-[250px] lg:basis-[275px]';

@Component({
  selector: 'me-media-carousel-cover-item',
  imports: [NgOptimizedImage, NgIcon],
  templateUrl: './media-carousel-cover-item.me.html',
  styleUrl: './media-carousel-cover-item.me.css',
  providers: [provideIcons({ lucideStar })],
})
export class MediaCarouselCoverItemMe extends MediaCarouselItemBase<MediaCarouselItem> {}
