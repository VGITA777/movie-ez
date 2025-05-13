import {Component, input, InputSignal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-media-card',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss'
})
export class MediaCardComponent {
  readonly title: InputSignal<string> = input.required();
  readonly poster: InputSignal<string> = input.required();
  readonly mediaType: InputSignal<string> = input.required();
  readonly date: InputSignal<string> = input.required({transform: (date) => date.split('-')[0]});
  readonly imageLoadType: InputSignal<ImageLoadType> = input<ImageLoadType>('lazy');
}

export type ImageLoadType = 'lazy' | 'eager' | 'auto'
