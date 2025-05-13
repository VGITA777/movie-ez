import {Component, input, InputSignal, output, OutputEmitterRef, Signal, TemplateRef, viewChild} from '@angular/core';
import {MediaCardComponent} from "../media-card/media-card.component";
import {environment} from '../../../../environments/environment';
import {SliderComponent} from '../slider/slider.component';
import {SwiperOptions} from 'swiper/types';

@Component({
  selector: 'app-media-slider',
  imports: [
    MediaCardComponent,
    SliderComponent,
  ],
  templateUrl: './media-slider.component.html',
  styleUrl: './media-slider.component.scss'
})
export class MediaSliderComponent {

  readonly title: InputSignal<string> = input.required();
  readonly subHeader: InputSignal<string> = input.required();
  readonly data: InputSignal<MediaLike[]> = input.required();
  readonly mediaType: InputSignal<string> = input.required();
  readonly customDesign: InputSignal<TemplateRef<any> | undefined> = input();
  readonly onCardClick: OutputEmitterRef<MediaLike> = output();

  protected readonly environment = environment;
  protected readonly slider: Signal<SliderComponent> = viewChild.required('slider')

  ngAfterViewInit() {
    const swiperOptions: SwiperOptions = {
      ...this.slider().defaultSwiperOptions,
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
    this.slider().initSwiperWithOptions(swiperOptions);
  }

  onCardClickHandler(data: MediaLike) {
    this.onCardClick.emit(data);
  }
}

export type MediaLike = {
  id: number,
  title?: string,
  name?: string,
  poster_path: string,
  release_date?: string,
  first_air_date?: string,
  media_type?: string,
}
