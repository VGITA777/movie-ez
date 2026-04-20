import {AfterContentInit, contentChildren, Directive, ElementRef, inject, Renderer2, Signal} from '@angular/core';
import {ShineCardComponent} from '../ui/shine-card/shine-card.component';

@Directive({
  selector: '[appShineCardGroup]'
})
export class ShineCardGroupDirective implements AfterContentInit {

  private readonly renderer: Renderer2 = inject(Renderer2);
  protected readonly containerRef: ElementRef<HTMLElement> = inject(ElementRef)
  protected readonly shineCards: Signal<readonly ShineCardComponent[]> = contentChildren<ShineCardComponent>(ShineCardComponent, {descendants: true});

  ngAfterContentInit(): void {
    this.addShineEffect();
  }

  private addShineEffect(): void {
    const shineGroupContainer: HTMLElement = this.containerRef.nativeElement;
    this.renderer.listen(shineGroupContainer, 'mousemove', (ev: MouseEvent) => {
      this.shineCards().forEach((card: ShineCardComponent) => {
        const rect: DOMRect = card.cardRef().nativeElement.getBoundingClientRect();
        const x: number = ev.clientX - rect.left;
        const y: number = ev.clientY - rect.top;
        card.setShineProperties(x, y);
      })
    })
  }
}
