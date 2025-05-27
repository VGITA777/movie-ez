import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  InputSignal,
  Signal,
  viewChild, ViewEncapsulation
} from '@angular/core';
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
  readonly shineColor: InputSignal<Color> = input({red: 255, blue: 255, green: 255});
  readonly backgroundColor: InputSignal<Color> = input({red: 15, blue: 15, green: 15});
  readonly shineRadius: InputSignal<number> = input(200);

  private cardRef: Signal<ElementRef<HTMLDivElement>> = viewChild.required('cardRef');

  ngAfterViewInit(): void {
    this.cardRef().nativeElement.onmousemove = ev => this.addShineEffect(ev);
  }

  private addShineEffect(ev: MouseEvent): void {
    const element = this.cardRef().nativeElement
    const rect = element.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    console.log(`Shine effect at: ${x}, ${y}`);
    element.style.setProperty('--shine-pos-x', `${x}px`);
    element.style.setProperty('--shine-pos-y', `${y}px`);
  }
}

export interface Color {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}
