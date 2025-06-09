import {AfterViewInit, Component, ElementRef, input, InputSignal, Signal, viewChild} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-shine-card',
  imports: [
    NgStyle
  ],
  templateUrl: './shine-card.component.html',
  styleUrl: './shine-card.component.scss',
  host: {'style.background-color': 'red'},
})
export class ShineCardComponent implements AfterViewInit {
  readonly initShine: InputSignal<boolean> = input(true);
  readonly shineColor: InputSignal<Color> = input({red: 255, blue: 255, green: 255});
  readonly backgroundColor: InputSignal<Color> = input({red: 15, blue: 15, green: 15});
  readonly shineRadius: InputSignal<number> = input(200);
  readonly padding: InputSignal<string> = input('0px');
  readonly borderOpacity: InputSignal<number> = input(0);
  readonly borderOpacityHover: InputSignal<number> = input(1);
  readonly borderRadius: InputSignal<string> = input('unset');
  readonly cardRef: Signal<ElementRef<HTMLDivElement>> = viewChild.required('cardRef');

  ngAfterViewInit(): void {
    if (this.initShine()) {
      this.cardRef().nativeElement.onmousemove = ev => this.addShineEffect(ev);
    }
  }

  public setShineProperties(x: number, y: number): void {
    this.cardRef().nativeElement.style.setProperty('--shine-pos-x', `${x}px`);
    this.cardRef().nativeElement.style.setProperty('--shine-pos-y', `${y}px`);
  }

  private addShineEffect(ev: MouseEvent): void {
    const element = this.cardRef().nativeElement
    const rect = element.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    this.setShineProperties(x, y);
  }
}

export interface Color {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly opacity?: number;
}
