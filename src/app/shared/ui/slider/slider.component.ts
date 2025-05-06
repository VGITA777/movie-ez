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
  readonly design: InputSignal<TemplateRef<any>> = input.required();
  readonly data: InputSignal<any[]> = input.required();
  readonly gap: InputSignal<string> = input('unset');
  readonly swiperOptions: InputSignal<SwiperOptions | undefined> = input()
  readonly swiperContainer: Signal<ElementRef<SwiperContainer>> = viewChild.required('swiper')

  protected readonly swiperPagination: Signal<ElementRef<HTMLDivElement>> = viewChild.required('swiperPagination');

  ngOnInit() {
    const defaultSwiperOptions: SwiperOptions = {
      modules: [Pagination],
      slidesPerView: 'auto',
      direction: 'horizontal',
      spaceBetween: 12,
      pagination: {
        enabled: true,
        el: this.swiperPagination().nativeElement,
        type: 'bullets',
        bulletElement: 'span',
        renderBullet: (_index: number, className: string) => {
          return '<span class="' + className + '"></span>';
        }
      }
    }
    const sp: SwiperContainer = this.swiperContainer().nativeElement;
    Object.assign(sp, this.swiperOptions() ?? defaultSwiperOptions);
    sp.initialize();
  }
}
