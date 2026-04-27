import {
  Directive,
  effect,
  EffectRef,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  output,
  OutputEmitterRef,
} from '@angular/core';

@Directive({
  selector: '[meNotVisibleFor]',
})
export class NotVisibleFor implements OnDestroy {
  public readonly notVisibleTimer: InputSignal<number> = input(2000);
  public readonly threshold: InputSignal<number> = input(0.5);
  public readonly onceNotVisible: InputSignal<boolean> = input(false);
  public readonly immediateCheck: InputSignal<boolean> = input(false);
  public readonly notVisibleLongEnough: OutputEmitterRef<void> = output();

  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private hasBeenVisible: boolean = false;
  private readonly effect: EffectRef;

  constructor() {
    this.effect = effect(() => {
      this.setupObserver(this.threshold());
    });
  }

  private setupObserver(thresholdValue: number) {
    this.cleanup();

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.hasBeenVisible) {
          this.hasBeenVisible = true;
        }

        if (!entry.isIntersecting && (this.hasBeenVisible || this.immediateCheck())) {
          this.timer = setTimeout(() => {
            this.notVisibleLongEnough.emit();

            if (this.onceNotVisible()) {
              this.cleanup(true);
            }
          }, this.notVisibleTimer());
        } else {
          clearTimeout(this.timer);
        }
      },
      {
        threshold: thresholdValue,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  private cleanup(destroyEffect: boolean = false) {
    if (this.observer) {
      this.observer.disconnect();
    }
    clearTimeout(this.timer);

    if (destroyEffect) {
      this.effect.destroy();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }
}
