import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  TemplateRef,
} from '@angular/core';
import { ID } from '@shared/shared-types';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { NgTemplateOutlet } from '@angular/common';
import { EmblaOptionsType } from 'embla-carousel-angular';
import { MediaCarouselTopItem } from '@shared/ui/media-carousel/media-carousel-top-item/media-carousel-top-item.me';
import { MediaCarouselBackdropItem } from '@shared/ui/media-carousel/media-carousel-backdrop-item/media-carousel-backdrop-item.me';
import { InteractiveMediaCardItem } from '@shared/ui/interactive-media-card/interactive-media-card.me';

export interface MediaCarouselItem extends InteractiveMediaCardItem {
  readonly id: ID;
  readonly title: string;
  readonly imgSrc: string;
  readonly rating: number;
  readonly genre: string;
  readonly year: number;
}

export type MediaCarouselOutput =
  | MediaCarouselItem
  | MediaCarouselBackdropItem
  | MediaCarouselTopItem;

@Component({
  selector: 'me-media-carousel',
  imports: [HlmCarouselImports, NgTemplateOutlet],
  templateUrl: './media-carousel.me.html',
  styleUrl: './media-carousel.me.css',
})
export class MediaCarouselMe {
  public readonly items: InputSignal<MediaCarouselItem[]> = input.required();
  public readonly template: InputSignal<TemplateRef<unknown>> = input.required();
  public readonly carouselOptions: InputSignal<Partial<EmblaOptionsType>> = input<
    Partial<EmblaOptionsType>
  >({
    loop: true,
    dragFree: true,
  });
  public readonly itemClick: OutputEmitterRef<MediaCarouselOutput> = output();
}
