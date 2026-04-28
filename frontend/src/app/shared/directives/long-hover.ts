import {
  Directive,
  effect,
  HostListener,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';

@Directive({
  selector: '[meLongHover]',
})
export class LongHover {
  public readonly longHoverDelay: InputSignal<number> = input(1000);
  public readonly longHover: OutputEmitterRef<boolean> = output();

  private readonly isHovered: WritableSignal<boolean> = signal(false);

  constructor() {
    effect((onCleanup) => {
      if (!this.isHovered()) {
        this.longHover.emit(false);
        return;
      }

      let timeout: number = setTimeout(() => {
        this.longHover.emit(true);
      }, this.longHoverDelay());

      onCleanup(() => {
        clearTimeout(timeout);
      });
    });
  }

  @HostListener('mouseenter')
  protected onMouseEnter(): void {
    this.isHovered.set(true);
  }

  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    this.isHovered.set(false);
  }
}
