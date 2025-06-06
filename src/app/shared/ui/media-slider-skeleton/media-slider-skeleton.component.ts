import {Component, computed, input, InputSignal, Signal} from '@angular/core';
import {MediaSliderComponent} from '../media-slider/media-slider.component';
import {SkeletonComponent} from '../skeleton/skeleton.component';

@Component({
  selector: 'app-media-slider-skeleton',
  imports: [
    MediaSliderComponent,
    SkeletonComponent
  ],
  templateUrl: './media-slider-skeleton.component.html',
  styleUrl: './media-slider-skeleton.component.scss'
})
export class MediaSliderSkeletonComponent {
  readonly title: InputSignal<string> = input('Loading...');
  readonly subheader: InputSignal<string> = input('This section is currently being loaded.');
  readonly skeletonAmount: InputSignal<number> = input(10);
  protected readonly skeletonData: Signal<any[]> = computed(() => {
    return Array(this.skeletonAmount()).fill(null);
  })
}
