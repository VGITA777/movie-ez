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
  selector: '[meVisibleFor]',
})
export class VisibleFor implements OnDestroy {
  public readonly visibleForDelay: InputSignal<number> = input(2000);
  public readonly visibleThreshold: InputSignal<number> = input(0.5);
  public readonly visibleOnceEmmit: InputSignal<boolean> = input(false);
  public readonly visibleLongEnough: OutputEmitterRef<void> = output<void>();

  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private readonly effect: EffectRef;

  constructor() {
    this.effect = effect(() => {
      this.setupObserver(this.visibleThreshold());
    });
  }

  private setupObserver(thresholdValue: number) {
    this.cleanup();

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.timer = setTimeout(() => {
            this.visibleLongEnough.emit();

            if (this.visibleOnceEmmit()) {
              this.cleanup(true);
            }
          }, this.visibleForDelay());
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
