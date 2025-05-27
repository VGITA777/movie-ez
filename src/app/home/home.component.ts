import {Component, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MovieDiscoverResult, PopularMovies, PopularTvShows, TvShowDiscoverResult} from 'tmdb-ts';
import {take} from 'rxjs';
import {ProgressShowerService} from '../shared/utils/progress-shower.service';
import {MediaSliderComponent} from '../shared/ui/media-slider/media-slider.component';

@Component({
  selector: 'app-home',
  imports: [
    MediaSliderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly discoverMovies: WritableSignal<MovieDiscoverResult | undefined> = signal(undefined);
  readonly discoverTvShows: WritableSignal<TvShowDiscoverResult | undefined> = signal(undefined);
  readonly popularMovies: WritableSignal<PopularMovies | undefined> = signal(undefined);
  readonly popularTvShows: WritableSignal<PopularTvShows | undefined> = signal(undefined);

  constructor(readonly activatedRoute: ActivatedRoute, readonly progressShower: ProgressShowerService) {
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(take(1)).subscribe((data) => {
      this.discoverMovies.set(data['discoverMovies']);
      this.discoverTvShows.set(data['discoverTvShows']);
      this.popularMovies.set(data['popularMovies']);
      this.popularTvShows.set(data['popularTvShows']);
      this.progressShower.hide();
    })
  }
}
