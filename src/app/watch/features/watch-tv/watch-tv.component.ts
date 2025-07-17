/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, computed, effect, inject, linkedSignal, Signal, signal, WritableSignal} from '@angular/core';
import {DropDownSelectComponent, Option} from '@ui/drop-down-select/drop-down-select.component';
import {TvShowGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {TV_EMBED_OBJS, TvMediaLinkProvider} from '../../../shared/watch-provider/media-link-provider';
import {Recommendations, Season, TvShowDetails} from 'tmdb-ts';
import {VideoSource} from '../../../shared/constants';
import {ShineCardComponent} from '@ui/shine-card/shine-card.component';
import {MediaLike, MediaSliderComponent} from '@ui/media-slider/media-slider.component';
import {NavigatorService} from '../../../shared/utils/navigator.service';
import {SkeletonComponent} from '@ui/skeleton/skeleton.component';

@Component({
  selector: 'app-watch-tv',
  imports: [
    DropDownSelectComponent,
    ShineCardComponent,
    MediaSliderComponent,
    SkeletonComponent
  ],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent extends WatchPage<TvMediaLinkProvider, TvShowGenericMediaInfo, TvShowDetails> {

  protected readonly navigatorService: NavigatorService = inject(NavigatorService);
  protected readonly mediaLinkProviders: Signal<Record<VideoSource, TvMediaLinkProvider>> = signal(TV_EMBED_OBJS);
  // Season Options
  protected readonly seasons: Signal<Season[]> = computed(() => this.mediaDetailsRequest
    .value()?.seasons
    ?.filter(s => s.season_number !== 0) ?? []);
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

  // Used for the generic media info (ID, Season, Episode)
  protected override readonly genericMediaInfo: Signal<TvShowGenericMediaInfo> = computed(() => ({
    id: this.mediaId(),
    season: Number(this.selectedSeasonOption().value) ?? 1,
    episode: Number(this.selectedEpisodeOption().value) ?? 1
  }));

  protected override mediaDetailsLoader(id: number): Promise<TvShowDetails> {
    return this.tmdb.tvShows.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.tvShows.recommendations(id);
  }

  protected handleOnCardClick(media: MediaLike): void {
    this.navigatorService.navigateToWatch(media);
  }

  constructor() {
    super();

    effect(() => {
      console.log(`Is loading: ${this.mediaDetailsRequest.isLoading()}`);
    })
  }
}
