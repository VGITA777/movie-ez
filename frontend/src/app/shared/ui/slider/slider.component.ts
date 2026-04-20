import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  InputSignal,
  OnInit,
  Signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {SwiperOptions} from 'swiper/types';
import {SwiperContainer} from 'swiper/element';
import {FreeMode, Pagination} from 'swiper/modules';

@Component({
  selector: 'app-slider',
  imports: [
    NgTemplateOutlet,

  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent implements OnInit {
  defaultSwiperOptions!: SwiperOptions;

  readonly design: InputSignal<TemplateRef<unknown>> = input.required();
  readonly data: InputSignal<unknown[]> = input.required();
  readonly gap: InputSignal<string> = input("12px");
  readonly swiperOptions: InputSignal<SwiperOptions | undefined> = input()
  readonly swiperContainer: Signal<ElementRef<SwiperContainer>> = viewChild.required('swiper')
  readonly init: InputSignal<boolean> = input(true);
  readonly withProgress: InputSignal<boolean> = input(true);
  protected readonly swiperPagination: Signal<ElementRef<HTMLDivElement>> = viewChild.required('swiperPagination');

  ngOnInit() {
    this.defaultSwiperOptions = {
      modules: [Pagination, FreeMode],
      slidesPerView: 'auto',
      direction: 'horizontal',
      spaceBetween: this.gap(),
      pagination: {
        enabled: this.withProgress(),
        el: this.swiperPagination().nativeElement,
        type: 'bullets',
        bulletElement: 'span',
        renderBullet: (_index: number, className: string) => {
          return '<span class="' + className + '"></span>';
        }
      },
      freeMode: {
        enabled: true,
      }
    }

    if (this.init()) {
      this.initSwiper();
    }
  }

  initSwiperWithOptions(options: SwiperOptions): void {
    const sp: SwiperContainer = this.swiperContainer().nativeElement;
    Object.assign(sp, options);
    sp.initialize();
  }

  initSwiper(): void {
    this.initSwiperWithOptions(this.swiperOptions() ?? this.defaultSwiperOptions);
  }
}
