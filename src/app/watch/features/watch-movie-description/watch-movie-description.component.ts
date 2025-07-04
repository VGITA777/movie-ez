import {Component, computed, effect, Signal} from '@angular/core';
import {MediaDetailsPage, MovieGenericMediaInfo} from '../../data-access/watch-page';
import {MovieDetails, Recommendations} from 'tmdb-ts';
import {ChipSliderComponent} from "../../../shared/ui/chip-slider/chip-slider.component";
import {ReadMoreTextComponent} from "../../../shared/ui/read-more-text/read-more-text.component";
import {SkeletonComponent} from '../../../shared/ui/skeleton/skeleton.component';
import {ImageTitleComponent} from '../../ui/image-title/image-title.component';

@Component({
  selector: 'app-watch-movie-description',
  imports: [
    ChipSliderComponent,
    ReadMoreTextComponent,
    SkeletonComponent,
    ImageTitleComponent
  ],
  templateUrl: './watch-movie-description.component.html',
  styleUrl: './watch-movie-description.component.scss'
})
export class WatchMovieDescriptionComponent extends MediaDetailsPage<MovieGenericMediaInfo, MovieDetails> {
  protected override genericMediaInfo: Signal<MovieGenericMediaInfo> = computed(() => ({id: this.mediaId()}));
  protected readonly genresName: Signal<string[]> = computed(() => this.genres().map(g => g.name));
  protected readonly duration: Signal<string> = computed(() => {
    if (this.mediaDetails.isLoading()) {
      return 'loading...';
    }
    const duration: number = this.mediaDetails.value().runtime ?? 0;
    if (duration === 0) {
      return '0';
    }
    if (duration < 60) {
      return `${duration} min`;
    }
    const hours: number = Math.floor(duration / 60);
    const minutes: number = duration % 60;
    return `${hours}h ${minutes}m`;
  });

  constructor() {
    super();
    effect(() => {
      console.log(`Is loading: ${this.mediaDetails.isLoading()}`);
    })
  }

  protected override mediaDetailsLoader(id: number): Promise<MovieDetails> {
    return this.tmdb.movies.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.movies.recommendations(id);
  }
}
