import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'app-indeterminate-progress-bar',
  imports: [],
  templateUrl: './indeterminate-progress-bar.component.html',
  styleUrl: './indeterminate-progress-bar.component.scss'
})
export class IndeterminateProgressBarComponent {
  readonly width: InputSignal<string> = input('100%');
  readonly height: InputSignal<string> = input('2px');
  readonly progressColor: InputSignal<string> = input('unset');
}
