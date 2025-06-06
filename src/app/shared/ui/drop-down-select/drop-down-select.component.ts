import {Component, input, InputSignal, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-drop-down-select',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './drop-down-select.component.html',
  styleUrl: './drop-down-select.component.scss'
})
export class DropDownSelectComponent {
  readonly options: InputSignal<Option[]> = input.required();
  readonly optionTemplate: InputSignal<TemplateRef<unknown> | undefined> = input();
  readonly selectedOption: InputSignal<Option> = input(this.options()[0]);
  readonly backgroundColor: InputSignal<string> = input('unset');
}

export interface Option {
  value: any,
  label: string
}
