import {Component, computed, inject, linkedSignal, Signal, signal, WritableSignal} from '@angular/core';
import {DropDownSelectComponent, Option} from '../../../shared/ui/drop-down-select/drop-down-select.component';
import {TvShowGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {ActivatedRoute} from '@angular/router';
import {TV_EMBED_OBJS, TvMediaLinkProvider} from '../../../shared/watch-provider/media-link-provider';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {Season, TvShowDetails} from 'tmdb-ts';
import {VideoSource} from '../../../shared/constants';
import {ShineCardComponent} from '../../../shared/ui/shine-card/shine-card.component';

@Component({
  selector: 'app-watch-tv',
  imports: [
    DropDownSelectComponent,
    ShineCardComponent
  ],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent extends WatchPage<TvMediaLinkProvider, TvShowGenericMediaInfo, TvShowDetails> {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly mediaLinkProviders: Signal<Record<VideoSource, TvMediaLinkProvider>> = signal(TV_EMBED_OBJS);
  protected readonly mediaId: Signal<number> = toSignal(this.activatedRoute.paramMap.pipe(map((params) => Number(params.get('id')) ?? 0)), {initialValue: 0});
  // Season Options
  protected readonly seasons: Signal<Season[]> = computed(() => this.mediaDetails
    .value().seasons
    .filter(s => s.season_number !== 0) ?? []);
  // Selections
  protected readonly selectedSeasonOption: WritableSignal<Option> = signal({label: '1', value: 1});
  protected readonly seasonsOptions: Signal<Option[]> = computed((): Option[] =>
    this.seasons()
      ?.filter(s => s.episode_count > 0)
      ?.map(s => ({
        label: s.name,
        value: s.season_number
      })) ?? []
  );
  // Episode options
  protected readonly episodes: Signal<Option[]> = computed(() => {
    const count = this.seasons()?.find(s => s.season_number === this.selectedSeasonOption().value)?.episode_count ?? 0;
    return Array.from({length: count}, (_, i) => i + 1).map(n => ({label: `Ep ${n.toString()}`, value: n}));
  })
  protected readonly selectedEpisodeOption: WritableSignal<Option> = linkedSignal({
    source: this.selectedSeasonOption,
    computation: (): Option => ({label: '1', value: 1}),
  })
  protected override readonly genericMediaInfo: Signal<TvShowGenericMediaInfo> = computed(() => ({
    id: this.mediaId(),
    season: Number(this.selectedSeasonOption().value) ?? 1,
    episode: Number(this.selectedEpisodeOption().value) ?? 1
  }));

  protected override loader(id: number): Promise<TvShowDetails> {
    return this.tmdb.tvShows.details(id);
  }
}
