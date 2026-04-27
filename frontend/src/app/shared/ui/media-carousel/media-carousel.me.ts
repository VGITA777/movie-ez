import { Component, input, InputSignal, TemplateRef } from '@angular/core';
import { ID } from '@shared/shared-types';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { NgTemplateOutlet } from '@angular/common';
import { EmblaOptionsType } from 'embla-carousel-angular';

export interface MediaCarouselItem {
  readonly id: ID;
  readonly title: string;
  readonly imgSrc: string;
  readonly rating: number;
  readonly genre: string;
  readonly year: number;
}

@Component({
  selector: 'me-media-carousel',
  imports: [HlmCarouselImports, NgTemplateOutlet],
  templateUrl: './media-carousel.me.html',
  styleUrl: './media-carousel.me.css',
})
export class MediaCarouselMe {
  public items: InputSignal<MediaCarouselItem[]> = input.required();
  public template: InputSignal<TemplateRef<unknown>> = input.required();
  public carouselOptions: InputSignal<Partial<EmblaOptionsType>> = input<Partial<EmblaOptionsType>>(
    {
      loop: true,
      dragFree: true,
    },
  );
}
