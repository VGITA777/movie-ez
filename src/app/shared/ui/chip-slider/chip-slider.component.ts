import {Component, input, InputSignal} from '@angular/core';
import {SliderComponent} from '../slider/slider.component';

@Component({
  selector: 'app-chip-slider',
  imports: [
    SliderComponent
  ],
  templateUrl: './chip-slider.component.html',
  styleUrl: './chip-slider.component.scss'
})
export class ChipSliderComponent {
  readonly data: InputSignal<string[]> = input.required();
  readonly fontSize: InputSignal<string> = input('.8rem');
  readonly chipBackgroundColor: InputSignal<string> = input('unset');
  readonly chipTextColor: InputSignal<string> = input('unset');
  readonly width: InputSignal<string> = input('100%');
}
