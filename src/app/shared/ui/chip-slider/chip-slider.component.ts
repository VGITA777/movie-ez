import {Component, input, InputSignal} from '@angular/core';
import {SliderComponent} from '../slider/slider.component';
import {ShineCardComponent} from '../shine-card/shine-card.component';
import {NgStyle, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-chip-slider',
  imports: [
    SliderComponent,
    ShineCardComponent,
    NgTemplateOutlet,
    NgStyle
  ],
  templateUrl: './chip-slider.component.html',
  styleUrl: './chip-slider.component.scss'
})
export class ChipSliderComponent {
  readonly data: InputSignal<string[]> = input.required();
  readonly fontSize: InputSignal<string> = input('.7rem');
  readonly chipBackgroundColor: InputSignal<string> = input('unset');
  readonly chipTextColor: InputSignal<string> = input('unset');
  readonly width: InputSignal<string> = input('100%');
  readonly withShine: InputSignal<boolean> = input(true);
  readonly gap: InputSignal<string> = input('4px');
}
