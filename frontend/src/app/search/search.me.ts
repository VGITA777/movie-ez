import { Component, output, OutputEmitterRef } from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { MediaCarouselCoverItemMe } from '@shared/ui/media-carousel/media-carousel-cover-item/media-carousel-cover-item.me';
import { MediaCarouselItem } from '@shared/ui/media-carousel/media-carousel.me';
import { environment } from '@environments/environment';
import { NgTemplateOutlet } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';

@Component({
  selector: 'me-search',
  imports: [
    HlmInputGroupImports,
    HlmIconImports,
    HlmToggleGroupImports,
    MediaCarouselCoverItemMe,
    NgTemplateOutlet,
    HlmButtonImports,
    HlmDialogImports,
    NgScrollbar,
    HlmScrollAreaImports,
  ],
  templateUrl: './search.me.html',
  styleUrl: './search.me.css',
  providers: [provideIcons({ lucideSearch, lucideX })],
})
export class SearchMe {
  public onCloseClick: OutputEmitterRef<void> = output();

  protected readonly items: MediaCarouselItem[] = [
    {
      id: 157336,
      title: 'Interstellar',
      imgSrc: `${environment.tmdb.imageBaseUrl}original/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg`,
      rating: 9.8,
      genres: ['Sci-Fi'],
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
      genres: ['Adventure'],
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
      genres: ['Action', 'Crime'],
      year: 2024,
      videoSrc:
        'https://www.youtube.com/embed/tcrNsIaQkb4?autoplay=1&mute=1&controls=0&loop=1&disablekb=1?playlist=tcrNsIaQkb4',
      type: 'tv',
    },
  ];
}
