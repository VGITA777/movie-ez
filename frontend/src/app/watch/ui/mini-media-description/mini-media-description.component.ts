import {Component, inject, input, InputSignal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ChipSliderComponent} from '@ui/chip-slider/chip-slider.component';
import {DeviceSizeService} from '@utils/device-size.service';
import {ReadMoreTextComponent} from '@ui/read-more-text/read-more-text.component';

@Component({
  selector: 'app-mini-media-description',
  imports: [
    NgOptimizedImage,
    ChipSliderComponent,
    ReadMoreTextComponent,
  ],
  templateUrl: './mini-media-description.component.html',
  styleUrl: './mini-media-description.component.scss'
})
export class MiniMediaDescriptionComponent {
  public readonly mediaTitle: InputSignal<string> = input("");
  public readonly imageSrc: InputSignal<string> = input.required();
  public readonly imageAlt: InputSignal<string> = input('');
  public readonly tags: InputSignal<string[]> = input<string[]>([]);
  public readonly mediaReleaseDate: InputSignal<string> = input('Unknown');
  public readonly mediaStatus: InputSignal<string> = input('Unknown');
  public readonly mediaRating: InputSignal<number> = input(0);
  public readonly mediaDescription: InputSignal<string | undefined> = input();
  protected readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
}
