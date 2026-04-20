/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, computed, Signal} from '@angular/core';
import {MediaDetailsPage, TvShowGenericMediaInfo} from '../../data-access/watch-page';
import {Recommendations, TvShowDetails} from 'tmdb-ts';
import {ImageTitleComponent} from '../../ui/image-title/image-title.component';
import {ChipSliderComponent} from '../../../shared/ui/chip-slider/chip-slider.component';
import {ReadMoreTextComponent} from '../../../shared/ui/read-more-text/read-more-text.component';
import {SkeletonComponent} from '../../../shared/ui/skeleton/skeleton.component';

@Component({
  selector: 'app-watch-tv-description',
  imports: [
    ImageTitleComponent,
    ChipSliderComponent,
    ReadMoreTextComponent,
    SkeletonComponent
  ],
  templateUrl: './watch-tv-description.component.html',
  styleUrl: './watch-tv-description.component.scss'
})
export class WatchTvDescriptionComponent extends MediaDetailsPage<TvShowGenericMediaInfo, TvShowDetails> {
  protected override genericMediaInfo: Signal<TvShowGenericMediaInfo> = computed((): TvShowGenericMediaInfo => ({
    id: this.mediaId(),
    season: 1,
    episode: 1
  }));

  protected readonly genresName: Signal<string[]> = computed(() => this.genres().map(g => g.name));
  protected readonly totalEpisodes: Signal<number> = computed(() => this.mediaDetailsRequest.value().number_of_episodes ?? 0);
  protected readonly totalSeasons: Signal<number> = computed(() => this.mediaDetailsRequest.value().number_of_seasons ?? 0);

  protected override mediaDetailsLoader(id: number): Promise<TvShowDetails> {
    return this.tmdb.tvShows.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.tvShows.recommendations(id);
  }
}
