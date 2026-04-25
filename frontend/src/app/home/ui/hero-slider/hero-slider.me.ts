import { Component, input, InputSignal } from '@angular/core';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { MediaType } from '@shared/models';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { lucidePlay, lucidePlus, lucideStar } from '@ng-icons/lucide';
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
  providers: [provideIcons({ lucidePlay, lucidePlus, lucideStar })],
  templateUrl: './hero-slider.me.html',
  styleUrl: './hero-slider.me.css',
})
export class HeroSliderMe {
  public readonly items: InputSignal<HomeHeroSliderItem[]> = input.required();
  plugins = [Autoplay({ delay: 5000, stopOnInteraction: true })];
  options: EmblaOptionsType = {
    loop: true
  };
}
