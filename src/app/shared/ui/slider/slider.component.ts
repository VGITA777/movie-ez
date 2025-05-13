import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  InputSignal,
  Signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {SwiperOptions} from 'swiper/types';
import {SwiperContainer} from 'swiper/element';
import {Pagination} from 'swiper/modules';

@Component({
  selector: 'app-slider',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent {
  defaultSwiperOptions!: SwiperOptions;

  readonly design: InputSignal<TemplateRef<any>> = input.required();
  readonly data: InputSignal<any[]> = input.required();
  readonly gap: InputSignal<string> = input('unset');
  readonly swiperOptions: InputSignal<SwiperOptions | undefined> = input()
  readonly swiperContainer: Signal<ElementRef<SwiperContainer>> = viewChild.required('swiper')
  protected readonly swiperPagination: Signal<ElementRef<HTMLDivElement>> = viewChild.required('swiperPagination');

  ngOnInit() {
    this.defaultSwiperOptions = {
      modules: [Pagination],
      slidesPerView: 8,
      direction: 'horizontal',
      spaceBetween: 8,
      pagination: {
        enabled: true,
        el: this.swiperPagination().nativeElement,
        type: 'bullets',
        bulletElement: 'span',
        renderBullet: (_index: number, className: string) => {
          return '<span class="' + className + '"></span>';
        }
      },
      breakpointsBase: 'container',
      breakpoints: {
        0: {
          slidesPerView: 2.2,
        },
        375: {
          slidesPerView: 2.5,
        },
        425: {
          slidesPerView: 2.8,
        },
        475: {
          slidesPerView: 3.5,
        },
        500: {
          slidesPerView: 3.5,
        },
        600: {
          slidesPerView: 4.5,
        },
        768: {
          slidesPerView: 5.5,
        },
        1024: {
          slidesPerView: 6.5,
        },
        1280: {
          slidesPerView: 7.5,
        },
        1536: {
          slidesPerView: 8.5,
        },
        1920: {
          slidesPerView: 9.5,
        }
      }
    }
    const sp: SwiperContainer = this.swiperContainer().nativeElement;
    Object.assign(sp, this.swiperOptions() ?? this.defaultSwiperOptions);
    sp.initialize();
  }
}
