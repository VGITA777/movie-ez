import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[meAutofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }
}
