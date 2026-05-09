import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[meAutofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    console.debug('AutofocusDirective: Setting focus on element', this.el.nativeElement);

    setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }
}
