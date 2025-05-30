import {
  Component,
  ElementRef,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  imports: [],
  templateUrl: './scroll-top.component.html',
  styleUrl: './scroll-top.component.scss'
})
export class ScrollTopComponent implements OnInit {
  readonly target: InputSignal<HTMLElement> = input(document.body);
  readonly scrollThreshold: InputSignal<number> = input(100);
  readonly visible: WritableSignal<boolean> = signal(false);
  readonly deleting: WritableSignal<boolean> = signal(false);
  private readonly elementRef: Signal<ElementRef<HTMLButtonElement>> = viewChild.required('button');

  ngOnInit(): void {
    this.target().onscroll = () => {
      this.watchScroll(this.target().scrollTop)
    }
  }

  protected watchScroll(y: number): void {
    if (y > this.scrollThreshold()) {
      this.show();
    } else {
      this.startDelete();
    }
  }

  protected show(): void {
    if (!this.visible()) {
      this.visible.set(true);
      return;
    }
  }

  protected startDelete(): void {
    const elementRef: HTMLButtonElement = this.elementRef().nativeElement;
    elementRef.addEventListener('transitionend', () => this.hide(), {once: true});
    this.deleting.set(true);
  }

  protected hide(): void {
    this.deleting.set(false);
    this.visible.set(false);
  }

  protected scrollToTop(): void {
    this.target().scrollTo({top: 0, behavior: 'smooth'});
  }
}
