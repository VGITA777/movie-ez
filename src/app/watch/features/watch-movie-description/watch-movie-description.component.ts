import {Component, computed, Signal} from '@angular/core';
import {MediaDetailsPage, MovieGenericMediaInfo} from '../../data-access/watch-page';
import {MovieDetails, Recommendations} from 'tmdb-ts';

@Component({
  selector: 'app-watch-movie-description',
  imports: [],
  templateUrl: './watch-movie-description.component.html',
  styleUrl: './watch-movie-description.component.scss'
})
export class WatchMovieDescriptionComponent extends MediaDetailsPage<MovieGenericMediaInfo, MovieDetails> {
  protected override genericMediaInfo: Signal<MovieGenericMediaInfo> = computed(() => ({id: this.mediaId()}));

  protected override mediaDetailsLoader(id: number): Promise<MovieDetails> {
    return this.tmdb.movies.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.movies.recommendations(id);
  }
}
