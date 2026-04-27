import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideStar } from '@ng-icons/lucide';

@Component({
  selector: 'me-media-carousel-cover-item',
  imports: [NgOptimizedImage, NgIcon],
  templateUrl: './media-carousel-cover-item.me.html',
  styleUrl: './media-carousel-cover-item.me.css',
  providers: [provideIcons({ lucideStar })],
})
export class MediaCarouselCoverItemMe {
  public readonly item: InputSignal<MediaCarouselItem> = input.required();
  public readonly itemClick: OutputEmitterRef<MediaCarouselItem> = output();
}
