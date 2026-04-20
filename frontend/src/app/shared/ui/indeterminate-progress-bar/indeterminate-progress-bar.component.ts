import {Component, input, InputSignal} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-indeterminate-progress-bar',
  imports: [
    NgStyle
  ],
  templateUrl: './indeterminate-progress-bar.component.html',
  styleUrl: './indeterminate-progress-bar.component.scss'
})
export class IndeterminateProgressBarComponent {
  readonly width: InputSignal<string> = input('100%');
  readonly height: InputSignal<string> = input('2px');
  readonly progressColor: InputSignal<string> = input('unset');
}
