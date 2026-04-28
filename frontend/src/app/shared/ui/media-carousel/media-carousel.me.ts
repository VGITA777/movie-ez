import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ID } from '@shared/shared-types';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { NgTemplateOutlet } from '@angular/common';
import { EmblaOptionsType } from 'embla-carousel-angular';
import { MediaCarouselTopItem } from '@shared/ui/media-carousel/media-carousel-top-item/media-carousel-top-item.me';
import { MediaCarouselBackdropItem } from '@shared/ui/media-carousel/media-carousel-backdrop-item/media-carousel-backdrop-item.me';
import { InteractiveMediaCardItem } from '@shared/ui/interactive-media-card/interactive-media-card.me';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

export interface MediaCarouselItem extends InteractiveMediaCardItem {
  readonly id: ID;
  readonly title: string;
  readonly imgSrc: string;
  readonly rating: number;
  readonly genre: string;
  readonly year: number;
}

export type MediaCarouselOutput =
  | MediaCarouselItem
  | MediaCarouselBackdropItem
  | MediaCarouselTopItem;

@Component({
  selector: 'me-media-carousel',
  imports: [HlmCarouselImports, NgTemplateOutlet, HlmIconImports],
  templateUrl: './media-carousel.me.html',
  styleUrl: './media-carousel.me.css',
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
})
export class MediaCarouselMe {
  public readonly items: InputSignal<MediaCarouselItem[]> = input.required();
  public readonly template: InputSignal<TemplateRef<unknown>> = input.required();
  public readonly carouselOptions: InputSignal<Partial<EmblaOptionsType>> = input<
    Partial<EmblaOptionsType>
  >({
    loop: true,
    dragFree: true,
  });
  public readonly itemClick: OutputEmitterRef<MediaCarouselOutput> = output();

  private readonly carousel: Signal<HlmCarousel> = viewChild.required('carousel');

  protected nextSlide(): void {
    if (!this.carousel().canScrollNext()) {
      return;
    }
    this.carousel().scrollNext();
  }

  protected prevSlide(): void {
    if (!this.carousel().canScrollPrev()) {
      return;
    }
    this.carousel().scrollPrev();
  }
}
