import {Component, input, InputSignal} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-skeleton',
  imports: [
    NgStyle
  ],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  readonly width: InputSignal<string> = input('unset');
  readonly height: InputSignal<string> = input('unset');
  readonly aspectRatio: InputSignal<string> = input('unset');
  readonly borderRadius: InputSignal<string> = input('0px');
}
