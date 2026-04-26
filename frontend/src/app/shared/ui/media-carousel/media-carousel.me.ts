import { Component } from '@angular/core';
import { ID } from '@shared/shared-types';

export interface MediaCarouselItem {
  readonly id: ID;
  readonly title: string;
  readonly imgSrc: string;
}

@Component({
  selector: 'me-media-carousel',
  imports: [],
  templateUrl: './media-carousel.me.html',
  styleUrl: './media-carousel.me.css',
})
export class MediaCarouselMe {}
