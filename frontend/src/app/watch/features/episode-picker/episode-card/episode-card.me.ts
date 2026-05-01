import { Component, effect, input, InputSignal } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { breakpoints } from '@signality/core';
import { DEFAULT_BREAKPOINTS } from '@shared/shared-types';

export interface EpisodeCardMeInput {
  episodeNumber: number;
  name: string;
  overview: string;
  imgSrc: string;
}

@Component({
  selector: 'me-episode-card',
  imports: [NgOptimizedImage, HlmCardImports, NgTemplateOutlet],
  templateUrl: './episode-card.me.html',
  styleUrl: './episode-card.me.css',
})
export class EpisodeCardMe {
  public readonly item: InputSignal<EpisodeCardMeInput> = input.required();

  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);

  constructor() {
    effect(() => {
      console.debug(`Breakpoints Is Sm:`, this.bp.sm());
    });
  }
}
