import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';
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
import { EmblaOptionsType } from 'embla-carousel-angular';
import { ID } from '@shared/shared-types';
import { HeroSliderItemMe } from '@home/ui/hero-slider/hero-slider-item/hero-slider-item.me';

export interface HomeHeroSliderItem {
  readonly id: ID;
  readonly imgSrc: string;
  readonly title: string;
  readonly rating: number;
  readonly type: MediaType;
  readonly description: string;
  readonly year: number;
  readonly tag: string;
  readonly videoSrc?: string;
}

@Component({
  selector: 'me-hero-slider',
  imports: [HlmCarouselImports, HlmButtonImports, HlmIconImports, HeroSliderItemMe],
  providers: [
    provideIcons({ lucidePlay, lucidePlus, lucideStar, lucideChevronRight, lucideChevronLeft }),
  ],
  templateUrl: './hero-slider.me.html',
  styleUrl: './hero-slider.me.css',
})
export class HeroSliderMe {
  public readonly items: InputSignal<HomeHeroSliderItem[]> = input.required();
  public readonly handlePlay: OutputEmitterRef<HomeHeroSliderItem> = output();
  /* TODO: Create a directive that handles adding media to a playlist */
  public readonly handleAddToPlaylist: OutputEmitterRef<HomeHeroSliderItem> = output();

  protected readonly carousel: Signal<HlmCarousel> = viewChild.required('carousel');
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
