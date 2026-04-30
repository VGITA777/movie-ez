import { Component, inject } from '@angular/core';
import { HeroSliderMe, HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { environment } from '../../environments/environment';
import {
  MediaCarouselItem,
  MediaCarouselMe,
  MediaCarouselOutput,
} from '@shared/ui/media-carousel/media-carousel.me';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import {
  MediaCarouselBackdropItem,
  MediaCarouselBackdropItemMe,
} from '@shared/ui/media-carousel/media-carousel-backdrop-item/media-carousel-backdrop-item.me';
import {
  MediaCarouselTopItem,
  MediaCarouselTopItemMe,
} from '@shared/ui/media-carousel/media-carousel-top-item/media-carousel-top-item.me';
import { NavigationFacade } from '@shared/navigation-facade.service';

@Component({
  selector: 'me-home',
  imports: [
    HeroSliderMe,
    MediaCarouselMe,
    MediaCarouselCoverItemMe,
    MediaCarouselBackdropItemMe,
    MediaCarouselTopItemMe,
  ],
  templateUrl: './home.me.html',
  styleUrl: './home.me.css',
})
export class HomeMe {
  protected readonly items: HomeHeroSliderItem[] = [
    {
      id: 157336,
      imgSrc: `${environment.tmdb.imageBaseUrl}original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg`,
      title: 'Interstellar',
      rating: 9.8,
      type: 'movie',
      description:
        'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the' +
        ' limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
      year: 2024,
      genres: ['Sci-Fi', 'Adventure'],
      videoSrc:
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
    },
    {
      id: 1290417,
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/3ooXDVaz4xHKtwe4lkmF1gNopOC.jpg`,
      rating: 6.8,
      type: 'movie',
      description:
        'When a Category 5 hurricane decimates a coastal town, the storm surge brings devastation, chaos, and' +
        ' something far more frightening onto shore: hungry sharks.',
      year: 2026,
      genres: ['Adventure', 'Drama'],
      videoSrc:
        'https://www.youtube.com/embed/hzyOsNyDkbM?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=hzyOsNyDkbM',
    },
    {
      id: 76479,
      imgSrc: `${environment.tmdb.imageBaseUrl}original/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg`,
      title: 'The Boys',
      rating: 8.4,
      type: 'tv',
      description:
        'A group of vigilantes known informally as “The Boys” set out to take down corrupt superheroes with no more than blue-collar grit and a willingness to fight dirty.',
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      genres: ['Action', 'Crime'],
    },
  ];
  protected readonly mediaItemsPoster: MediaCarouselItem[] = [
    {
      id: 157336,
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg`,
      rating: 9.8,
      genre: 'Sci-Fi',
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
      type: 'movie',
    },
    {
      id: 1290417,
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/adk8weka3O5648g3de4z3y4aE7G.jpg`,
      rating: 6.8,
      genre: 'Adventure',
      year: 2026,
      videoSrc:
        'https://www.youtube.com/embed/hzyOsNyDkbM?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=hzyOsNyDkbM',
      type: 'movie',
    },
    {
      id: 76479,
      title: 'The Boys',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/fRNBdaCZMM3DPGTtqdg6Zf1XwX5.jpg`,
      rating: 6.8,
      genre: 'Action / Crime',
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      type: 'movie',
    },
  ];
  protected readonly mediaItemsBackdrop: MediaCarouselBackdropItem[] = [
    {
      id: 157336,
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/rFvnZYcJzLoC2l6cTFLQRUgYSgL.jpg`,
      rating: 9.8,
      genre: 'Sci-Fi',
      year: 2024,
      runtime: 160,
      videoSrc:
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
      type: 'movie',
    },
    {
      id: 1290417,
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/4HIJS1btE2XvKoC0nqOr91uCcHE.jpg`,
      rating: 6.8,
      genre: 'Adventure',
      year: 2026,
      runtime: 90,
      videoSrc:
        'https://www.youtube.com/embed/hzyOsNyDkbM?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=hzyOsNyDkbM',
      type: 'movie',
    },
    {
      id: 76479,
      title: 'The Boys',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/6ZZKGi2UyYFtUIkyWAnoMZhcjpz.jpg`,
      rating: 6.8,
      genre: 'Action',
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      type: 'tv',
      runtime: 4,
    },
  ];
  protected readonly mediaItemsRanking: MediaCarouselTopItem[] = [
    {
      id: 157336,
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg`,
      rating: 9.8,
      genre: 'Sci-Fi',
      year: 2024,
      ranking: 1,
      videoSrc:
        'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=zSWdZVtXT7E',
      type: 'movie',
    },
    {
      id: 1290417,
      title: 'Thrash',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/adk8weka3O5648g3de4z3y4aE7G.jpg`,
      rating: 6.8,
      genre: 'Adventure',
      year: 2026,
      ranking: 2,
      videoSrc:
        'https://www.youtube.com/embed/hzyOsNyDkbM?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=hzyOsNyDkbM',
      type: 'movie',
    },
  ];

  private readonly navFacade: NavigationFacade = inject(NavigationFacade);

  protected handleItemClick(event: MediaCarouselOutput): void {
    this.navFacade.navigateToWatchPage({
      mediaId: event.id,
      mediaType: event.type,
    });
  }
}
