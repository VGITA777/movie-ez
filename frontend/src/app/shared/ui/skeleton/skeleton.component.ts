import {Component, input, InputSignal} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-skeleton',
  imports: [
    NgStyle
  ],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  host: {
    "[style.width]": "width()",
    "[style.height]": "height()"
  }
})
export class SkeletonComponent {
  readonly width: InputSignal<string> = input('auto');
  readonly height: InputSignal<string> = input('auto');
  readonly aspectRatio: InputSignal<string> = input('unset');
  readonly borderRadius: InputSignal<string> = input('0px');
}
