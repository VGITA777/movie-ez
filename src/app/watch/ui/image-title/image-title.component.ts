import {Component, input, InputSignal} from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';

@Component({
  selector: 'app-image-title',
  imports: [
    NgOptimizedImage,
    NgStyle
  ],
  templateUrl: './image-title.component.html',
  styleUrl: './image-title.component.scss'
})
export class ImageTitleComponent {
  readonly src: InputSignal<string> = input.required();
  readonly title: InputSignal<string> = input.required();
  readonly aspectRatio: InputSignal<string> = input("2/3");
  readonly width: InputSignal<string> = input("100%");
  readonly height: InputSignal<string> = input("auto");
  readonly titleMaxLines: InputSignal<number> = input(2);
  readonly borderRadius: InputSignal<string> = input("8px");
}
