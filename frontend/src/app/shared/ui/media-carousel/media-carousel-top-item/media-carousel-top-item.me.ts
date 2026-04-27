import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NgOptimizedImage } from '@angular/common';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { lucideStar } from '@ng-icons/lucide';

export type TopRanking = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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
export class MediaCarouselTopItemMe {
  public readonly item: InputSignal<MediaCarouselTopItem> = input.required();
  public readonly itemClick: OutputEmitterRef<MediaCarouselTopItem> = output();
}
