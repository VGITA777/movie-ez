import {Component, contentChild, ElementRef, input, output, OutputEmitterRef, Signal} from '@angular/core';

@Component({
  selector: 'app-bottom-nav-item',
  imports: [],
  templateUrl: './bottom-nav-item.component.html',
  styleUrl: './bottom-nav-item.component.scss'
})
export class BottomNavItemComponent {
  public readonly isActive: Signal<boolean> = input(false);
  public readonly onClick: OutputEmitterRef<void> = output<void>();
  public readonly navIcon: Signal<ElementRef<HTMLElement> | undefined> = contentChild('icon');
  public readonly navLabel: Signal<ElementRef<HTMLElement> | undefined> = contentChild('label');

  protected onClickHandler(): void {
    this.onClick.emit();
  }
}
