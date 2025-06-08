import {Component, signal, Signal} from '@angular/core';
import {MediaDetailsPage, TvShowGenericMediaInfo} from '../../data-access/watch-page';
import {Recommendations, TvShowDetails} from 'tmdb-ts';

@Component({
  selector: 'app-watch-tv-description',
  imports: [],
  templateUrl: './watch-tv-description.component.html',
  styleUrl: './watch-tv-description.component.scss'
})
export class WatchTvDescriptionComponent extends MediaDetailsPage<TvShowGenericMediaInfo, TvShowDetails> {
  protected override genericMediaInfo: Signal<TvShowGenericMediaInfo> = signal({
    id: this.mediaId(),
    season: 1,
    episode: 1
  });

  protected override mediaDetailsLoader(id: number): Promise<TvShowDetails> {
    return this.tmdb.tvShows.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.tvShows.recommendations(id);
  }
}
