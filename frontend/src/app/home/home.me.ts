import { Component } from '@angular/core';
import { HeroSliderMe, HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { environment } from '../../environments/environment';

@Component({
  selector: 'me-home',
  imports: [HeroSliderMe],
  templateUrl: './home.me.html',
  styleUrl: './home.me.css',
})
export class HomeMe {
  protected readonly items: HomeHeroSliderItem[] = [
    {
      id: '123',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg`,
      title: 'A very long title that cannot fit in one line.',
      rating: 9.8,
      type: 'movie',
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. " +
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. " +
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival",
      year: 2024,
      tag: 'Sci-Fi / Adventure',
    },
    {
      id: '123',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg`,
      title: 'Interstellar',
      rating: 9.8,
      type: 'movie',
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      year: 2024,
      tag: 'Sci-Fi / Adventure',
    },
  ];
}
