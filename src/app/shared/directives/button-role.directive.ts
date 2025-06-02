import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appButtonRole]'
})
export class ButtonRoleDirective implements AfterViewInit {
  private readonly el: ElementRef<unknown> = inject(ElementRef);

  ngAfterViewInit(): void {
    const element: unknown = this.el.nativeElement;
    if (element instanceof HTMLElement) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      element.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          element.click();
        }
      });
    }
  }
}
