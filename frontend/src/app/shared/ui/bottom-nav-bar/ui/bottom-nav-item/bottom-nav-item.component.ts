import {Component, contentChild, ElementRef, input, InputSignal, output, OutputEmitterRef, Signal} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-bottom-nav-item',
  imports: [
    NgClass
  ],
  templateUrl: './bottom-nav-item.component.html',
  styleUrl: './bottom-nav-item.component.scss'
})
export class BottomNavItemComponent {
  public readonly isActive: InputSignal<boolean> = input(false);
  public readonly onClick: OutputEmitterRef<void> = output<void>();
  public readonly navIcon: Signal<ElementRef<HTMLElement> | undefined> = contentChild('icon');
  public readonly navLabel: Signal<ElementRef<HTMLElement> | undefined> = contentChild('label');

  protected onClickHandler(): void {
    this.onClick.emit();
  }
}
