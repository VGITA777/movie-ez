import { Component } from '@angular/core';
import { HeroSliderMe, HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { environment } from '../../environments/environment';
import { MediaCarouselItem, MediaCarouselMe } from '@shared/ui/media-carousel/media-carousel.me';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';

@Component({
  selector: 'me-home',
  imports: [HeroSliderMe, MediaCarouselMe, MediaCarouselCoverItemMe],
  templateUrl: './home.me.html',
  styleUrl: './home.me.css',
})
export class HomeMe {
  protected readonly items: HomeHeroSliderItem[] = [
    {
      id: '123',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg`,
      title: 'Interstellar',
      rating: 9.8,
      type: 'movie',
      description:
        'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the' +
        ' limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
      year: 2024,
      tag: 'Sci-Fi / Adventure',
    },
    {
      id: '123',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/3ooXDVaz4xHKtwe4lkmF1gNopOC.jpg`,
      title: 'Thrash',
      rating: 6.8,
      type: 'movie',
      description:
        'When a Category 5 hurricane decimates a coastal town, the storm surge brings devastation, chaos, and' +
        ' something far more frightening onto shore: hungry sharks.',
      year: 2026,
      tag: 'Adventure / Drama',
    },
  ];

  protected readonly mediaItems: MediaCarouselItem[] = [
    {
      id: '123',
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/xWA7Bbo9VeahPcKCFYiC7NZXNoV.jpg`,
      rating: 9.8,
      genre: 'Sci-Fi',
      year: 2024,
    },
    {
      id: '123',
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/v6GKbuCUGy4KbEN0SOevSLJbWiG.jpg`,
      rating: 6.8,
      genre: 'Adventure',
      year: 2026,
    },
    {
      id: '123',
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/xWA7Bbo9VeahPcKCFYiC7NZXNoV.jpg`,
      rating: 9.8,
      genre: 'Sci-Fi',
      year: 2024,
    },
    {
      id: '123',
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/v6GKbuCUGy4KbEN0SOevSLJbWiG.jpg`,
      rating: 6.8,
      genre: 'Adventure',
      year: 2026,
    },
  ];
}
