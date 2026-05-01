import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { TvSeriesDetailsModel } from '@shared/models';
import { TvData } from '@shared/tv-data';

@Component({
  selector: 'me-episode-picker',
  imports: [],
  templateUrl: './episode-picker.me.html',
  styleUrl: './episode-picker.me.css',
})
export class EpisodePickerMe {
  public readonly itemData: InputSignal<TvData> = input.required();
  public readonly item: InputSignal<TvSeriesDetailsModel> = input.required();

  protected readonly totalSeasons: Signal<number> = computed(() => this.item().number_of_seasons);
}
