import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {MediaCardComponent} from "../media-card/media-card.component";
import {environment} from '../../../../environments/environment';
import {SliderComponent} from '../slider/slider.component';

@Component({
  selector: 'app-media-slider',
  imports: [
    MediaCardComponent,
    SliderComponent
  ],
  templateUrl: './media-slider.component.html',
  styleUrl: './media-slider.component.scss'
})
export class MediaSliderComponent {

  readonly title: InputSignal<string> = input.required();
  readonly subHeader: InputSignal<string> = input.required();
  readonly data: InputSignal<MediaLike[]> = input.required();
  readonly mediaType: InputSignal<string> = input.required();
  readonly onCardClick: OutputEmitterRef<MediaLike> = output();

  protected readonly environment = environment;

  onCardClickHandler(data: MediaLike) {
    this.onCardClick.emit(data);
  }
}

export type MediaLike = {
  id: number,
  poster_path: string,
  release_date: string,
  media_type?: string,
}
