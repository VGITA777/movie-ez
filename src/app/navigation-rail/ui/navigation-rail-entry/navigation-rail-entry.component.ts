import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';

@Component({
  selector: 'app-navigation-rail-entry',
  imports: [],
  templateUrl: './navigation-rail-entry.component.html',
  styleUrl: './navigation-rail-entry.component.scss'
})
export class NavigationRailEntryComponent {
  readonly onClick: OutputEmitterRef<void> = output();
  readonly active: InputSignal<boolean> = input(false);

  protected onClickHandler(): void {
    this.onClick.emit();
  }
}
