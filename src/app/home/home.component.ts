import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MovieDiscoverResult, PopularMovies, PopularTvShows, TvShowDiscoverResult} from 'tmdb-ts';
import {take} from 'rxjs';
import {ProgressShowerService} from '../shared/utils/progress-shower.service';
import {MediaSliderComponent} from '@ui/media-slider/media-slider.component';
import {ScrollTopComponent} from '@ui/scroll-top/scroll-top.component';
import {WatchNavigationHandler} from '../shared/utils/navigator.service';

@Component({
  selector: 'app-home',
  imports: [
    MediaSliderComponent,
    ScrollTopComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends WatchNavigationHandler implements OnInit {
  readonly discoverMovies: WritableSignal<MovieDiscoverResult> = signal({} as MovieDiscoverResult);
  readonly discoverTvShows: WritableSignal<TvShowDiscoverResult> = signal({} as TvShowDiscoverResult);
  readonly popularMovies: WritableSignal<PopularMovies> = signal({} as PopularMovies);
  readonly popularTvShows: WritableSignal<PopularTvShows> = signal({} as PopularTvShows);

  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

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
