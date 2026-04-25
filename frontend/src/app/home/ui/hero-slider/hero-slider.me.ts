import { Component, input, InputSignal } from '@angular/core';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { NgOptimizedImage } from '@angular/common';
import { MediaType } from '@shared/models';

export interface HomeHeroSliderItem {
  readonly imgSrc: string;
  readonly title: string;
  readonly rating: number;
  readonly type: MediaType;
}

@Component({
  selector: 'me-hero-slider',
  imports: [HlmCarouselImports, HlmCardImports, NgOptimizedImage],
  templateUrl: './hero-slider.me.html',
  styleUrl: './hero-slider.me.css',
  host: {
    width: '100%',
  },
})
export class HeroSliderMe {
  public readonly items: InputSignal<HomeHeroSliderItem[]> = input.required();
}
