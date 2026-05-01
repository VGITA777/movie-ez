import { Component, input, InputSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';

export interface EpisodeCardMeInput {
  episodeNumber: number;
  name: string;
  overview: string;
  imgSrc: string;
}

@Component({
  selector: 'me-episode-card',
  imports: [NgOptimizedImage, HlmCardImports],
  templateUrl: './episode-card.me.html',
  styleUrl: './episode-card.me.css',
})
export class EpisodeCardMe {
  public readonly item: InputSignal<EpisodeCardMeInput> = input.required();
}
