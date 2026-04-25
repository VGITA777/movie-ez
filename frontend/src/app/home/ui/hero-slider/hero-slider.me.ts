import { Component } from '@angular/core';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';

@Component({
  selector: 'me-hero-slider',
  imports: [HlmCarouselImports],
  templateUrl: './hero-slider.me.html',
  styleUrl: './hero-slider.me.css',
  host: {
    width: '100%',
  },
})
export class HeroSliderMe {}
