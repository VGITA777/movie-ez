import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { NgOptimizedImage } from '@angular/common';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideClock } from '@ng-icons/lucide';

export interface MediaCarouselBackdropItem extends MediaCarouselItem {
  readonly runtime: number;
}

@Component({
  selector: 'me-media-carousel-backdrop-item',
  imports: [NgOptimizedImage, HlmIconImports],
  templateUrl: './media-carousel-backdrop-item.me.html',
  styleUrl: './media-carousel-backdrop-item.me.css',
  providers: [provideIcons({ lucideClock })],
})
export class MediaCarouselBackdropItemMe {
  public readonly item: InputSignal<MediaCarouselBackdropItem> = input.required();
  public readonly itemClick: OutputEmitterRef<MediaCarouselBackdropItem> = output();

  protected convertRuntimeToHoursAndMinutes(runtime: number): string {
    const hours: number = Math.floor(runtime / 60);
    const minutes: number = runtime % 60;
    return `${hours}h ${minutes.toFixed(0)}m`;
  }
}
