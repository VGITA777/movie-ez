import {Component, input, InputSignal, linkedSignal, Signal, viewChild, WritableSignal} from '@angular/core';
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
  readonly errorImage: InputSignal<string> = input<string>('image/no_image_background.png');
  protected readonly currentImage: WritableSignal<string> = linkedSignal(this.poster);

  private readonly cardImage: Signal<HTMLImageElement> = viewChild.required("cardImage");

  protected onImageErrorHandler() {
    this.currentImage.set(this.errorImage());
    console.log(`Image load error for ${this.poster()}. Replaced with error image.`);
  }
}

export type ImageLoadType = 'lazy' | 'eager' | 'auto'
