import { Component, input, InputSignal, Signal, viewChild } from '@angular/core';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { MediaType } from '@shared/models';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucidePlay,
  lucidePlus,
  lucideStar,
} from '@ng-icons/lucide';
import { provideIcons } from '@ng-icons/core';
import Autoplay from 'embla-carousel-autoplay';
import { EmblaOptionsType } from 'embla-carousel-angular';

export interface HomeHeroSliderItem {
  readonly imgSrc: string;
  readonly title: string;
  readonly rating: number;
  readonly type: MediaType;
  readonly description: string;
  readonly year: number;
  readonly tag: string;
}

@Component({
  selector: 'me-hero-slider',
  imports: [HlmCarouselImports, HlmButtonImports, HlmIconImports],
  providers: [
    provideIcons({ lucidePlay, lucidePlus, lucideStar, lucideChevronRight, lucideChevronLeft }),
  ],
  templateUrl: './hero-slider.me.html',
  styleUrl: './hero-slider.me.css',
})
export class HeroSliderMe {
  public readonly items: InputSignal<HomeHeroSliderItem[]> = input.required();

  protected readonly carousel: Signal<HlmCarousel> = viewChild.required('carousel');
  protected readonly plugins = [Autoplay({ delay: 5000, stopOnInteraction: true })];
  protected readonly options: EmblaOptionsType = {
    loop: true,
  };

  protected onNext(): void {
    this.carousel().scrollNext();
  }

  protected onPrevious(): void {
    this.carousel().scrollPrev();
  }
}
