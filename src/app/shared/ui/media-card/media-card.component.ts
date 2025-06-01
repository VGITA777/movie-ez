import {Component, input, InputSignal} from '@angular/core';
import {NgOptimizedImage, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-media-card',
  imports: [
    NgOptimizedImage,
    UpperCasePipe
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
  protected readonly String = String;
}

export type ImageLoadType = 'lazy' | 'eager' | 'auto'
