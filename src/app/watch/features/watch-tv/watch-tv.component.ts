import {
  Component,
  computed,
  inject,
  linkedSignal,
  model,
  ModelSignal,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import {TvShowGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {TvMediaLinkProvider, VideasyTvMediaLinkProvider} from '../../../shared/watch-provider/media-link-provider';
import {Season, TvShowDetails} from 'tmdb-ts';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs';
import {DropDownSelectComponent, Option} from '../../../shared/ui/drop-down-select/drop-down-select.component';

@Component({
  selector: 'app-watch-tv',
  imports: [
    DropDownSelectComponent
  ],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent extends WatchPage<TvMediaLinkProvider, TvShowGenericMediaInfo, TvShowDetails> {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected override mediaLinkProvider: WritableSignal<TvMediaLinkProvider> = signal(new VideasyTvMediaLinkProvider());
  protected override genericMediaInfo: Signal<TvShowGenericMediaInfo> = toSignal(
    this.activatedRoute.paramMap.pipe(map((params): TvShowGenericMediaInfo => ({
        id: Number(params.get('id')) ?? 0,
      season: 0,
      episode: 0
      }))
    ),
    {initialValue: {id: 0, season: 1, episode: 0} as TvShowGenericMediaInfo}
  );

  // Season selection handlers
  protected readonly seasons: Signal<Season[] | undefined> = computed(() => this.mediaDetails.value().seasons);
  protected readonly seasonsOptions: Signal<Option[]> = computed((): Option[] =>
    this.seasons()
      ?.filter(s => s.episode_count > 0)
      ?.map(s => ({
        label: s.name,
        value: s.season_number
      })) ?? []
  );
  protected readonly selectedSeasonIndex: ModelSignal<number> = model(1);

  // Episode selection handlers
  protected readonly episodes: Signal<Option[]> = computed(() => {
    const count = this.seasons()?.[this.selectedSeasonIndex()]?.episode_count ?? 0;
    return Array.from({length: count}, (_, i) => i + 1).map(n => ({label: n.toString(), value: n}));
  })
  protected readonly selectedEpisodeIndex: WritableSignal<number> = linkedSignal({
    source: this.selectedSeasonIndex,
    computation: _ => 1
  });

  protected override loader(id: number): Promise<TvShowDetails> {
    return this.tmdb.tvShows.details(id);
  }
}
