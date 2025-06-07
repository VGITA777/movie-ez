import {Component, input, InputSignal, model, ModelSignal, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-drop-down-select',
  imports: [
    NgTemplateOutlet,
    FormsModule
  ],
  templateUrl: './drop-down-select.component.html',
  styleUrl: './drop-down-select.component.scss'
})
export class DropDownSelectComponent {
  readonly options: InputSignal<Option[]> = input.required();
  readonly optionTemplate: InputSignal<TemplateRef<unknown> | undefined> = input();
  readonly selected: ModelSignal<Option | undefined> = model();
  readonly backgroundColor: InputSignal<string> = input('unset');
  readonly width: InputSignal<string> = input('unset');
  readonly height: InputSignal<string> = input('unset');

  protected handleSelectionChange(event: any): void {
    const selectedOption: Option = this.options().find(option => option.value == event)!;
    this.selected.set(selectedOption);
  }
}

export interface Option {
  value: any,
  label: string
}
