/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, computed, inject, linkedSignal, Signal, signal, WritableSignal} from '@angular/core';
import {DropDownSelectComponent, Option} from '@ui/drop-down-select/drop-down-select.component';
import {TvShowGenericMediaInfo, WatchPage} from '@watch/data-access/watch-page';
import {TV_EMBED_OBJS, TvMediaLinkProvider} from '@shared/watch-provider/media-link-provider';
import {Recommendations, Season, TvShowDetails} from 'tmdb-ts';
import {VideoSource} from '@constants';
import {ShineCardComponent} from '@ui/shine-card/shine-card.component';
import {MediaLike, MediaSliderComponent} from '@ui/media-slider/media-slider.component';
import {NavigatorService} from '@utils/navigator.service';
import {SkeletonComponent} from '@ui/skeleton/skeleton.component';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {Router} from '@angular/router';
import {MediaSliderSkeletonComponent} from '@ui/media-slider-skeleton/media-slider-skeleton.component';
import {environment} from '@env/environment';

@Component({
  selector: 'app-watch-tv',
  imports: [
    DropDownSelectComponent,
    ShineCardComponent,
    MediaSliderComponent,
    SkeletonComponent,
    MediaSliderSkeletonComponent
  ],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent extends WatchPage<TvMediaLinkProvider, TvShowGenericMediaInfo, TvShowDetails> {

  protected readonly navigatorService: NavigatorService = inject(NavigatorService);
  protected readonly router: Router = inject(Router);
  protected readonly mediaLinkProviders: Signal<Record<VideoSource, TvMediaLinkProvider>> = signal(TV_EMBED_OBJS);
  // Season Options
  protected readonly seasons: Signal<Season[]> = computed(() => this.mediaDetailsRequest
    .value()?.seasons
    ?.filter(s => s.season_number !== 0) ?? []);
  protected readonly selectedSeasonFromUrl: Signal<number | undefined> = toSignal(
    this.activatedRoute.paramMap.pipe(map(p => Number(p.get('season')) ?? 1)),
  );
  protected readonly seasonOptions: Signal<Option[]> = computed((): Option[] =>
    this.seasons()
      ?.filter(s => s.episode_count > 0)
      ?.map(s => ({
        label: s.name,
        value: s.season_number
      })) ?? []
  );
  protected readonly selectedSeasonOption: WritableSignal<Option> = linkedSignal({
    source: this.selectedSeasonFromUrl,
    computation: (source): Option => {
      return {label: source?.toString() ?? '1', value: source ?? 1}
    }
  });
  // Episode options
  protected readonly selectedEpisodeFromUrl: Signal<number | undefined> = toSignal(
    this.activatedRoute.paramMap.pipe(map(p => Number(p.get('episode')) ?? 1)),
  );
  protected readonly episodeOptions: Signal<Option[]> = computed(() => {
    const count: number = this.seasons()?.find(s => s.season_number === this.selectedSeasonOption().value)?.episode_count ?? 0;
    return Array.from({length: count}, (_, i) => i + 1).map(n => ({label: `Ep ${n.toString()}`, value: n}));
  })
  protected readonly selectedEpisodeOption: WritableSignal<Option> = linkedSignal({
    source: this.selectedSeasonOption,
    computation: (): Option => {
      const selectedEp: number = this.selectedEpisodeFromUrl() ?? 1;
      return {label: selectedEp.toString(), value: selectedEp}
    }
  })

  // Used for the generic media info (ID, Season, Episode)
  protected override readonly genericMediaInfo: Signal<TvShowGenericMediaInfo> = computed(() => ({
    id: this.mediaId(),
    season: this.selectedSeasonFromUrl() ?? 1,
    episode: this.selectedEpisodeFromUrl() ?? 1
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

  protected handleOnSeasonChange(option: Option): void {
    if (environment.isLoggingEnabled) {
      console.log(`Selected season: ${option.value}`);
    }
    this.selectedSeasonOption.set(option);
    this.navigatorService.navigateToWatchSeries(this.mediaId(), option.value, 1);
  }

  protected handleOnEpisodeChange(option: Option): void {
    if (environment.isLoggingEnabled) {
      console.log(`Selected episode: ${option.value}`)
    }
    this.selectedEpisodeOption.set(option);
    this.navigatorService.navigateToWatchSeries(this.mediaId(), this.selectedSeasonFromUrl() ?? 1, option.value);
  }
}
