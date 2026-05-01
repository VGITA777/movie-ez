import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  ResourceRef,
  Signal,
} from '@angular/core';
import { TvSeasonDetailsEpisode, TvSeasonDetailsModel, TvSeriesDetailsModel } from '@shared/models';
import { TvSeasonData } from '@shared/tv-season-data';
import { MediaTvSeriesSeasonService } from '@shared/services/media-tv-series-season.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'me-episode-picker',
  imports: [],
  templateUrl: './episode-picker.me.html',
  styleUrl: './episode-picker.me.css',
})
export class EpisodePickerMe {
  public readonly item: InputSignal<TvSeriesDetailsModel & { id: number }> = input.required();

  protected readonly totalSeasons: Signal<number> = computed(() => this.item().number_of_seasons);
  protected readonly selectedSeason: Signal<number> = computed(() => {
    return 1;
  });
  protected readonly episodes: Signal<TvSeasonDetailsEpisode[]> = computed(() => {
    return this.seasonDetails.value()?.episodes ?? [];
  });

  private readonly tvSeriesSeasonService: MediaTvSeriesSeasonService = inject(
    MediaTvSeriesSeasonService,
  );
  private readonly itemData: Signal<TvSeasonData> = computed(() => {
    return new TvSeasonData(this.item().id, this.selectedSeason(), this.tvSeriesSeasonService);
  });
  private readonly seasonDetails: ResourceRef<TvSeasonDetailsModel | undefined> = rxResource({
    params: (): TvSeasonData => this.itemData(),
    stream: (data): Observable<TvSeasonDetailsModel> => {
      return data.params.getDetails();
    },
  });

  constructor() {
    effect(() => {
      console.debug(
        `Season info for season ${this.selectedSeason()} of series ${this.item().name} has been loaded:`,
        this.seasonDetails.value(),
      );
    });
  }
}
