import {Component, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MoviesPlayingNow, PopularMovies, TopRatedMovies, UpcomingMovies} from 'tmdb-ts';
import {take} from 'rxjs';
import {ProgressShowerService} from '../shared/utils/progress-shower.service';
import {MediaSliderComponent} from '../shared/ui/media-slider/media-slider.component';

@Component({
  selector: 'app-movies',
  imports: [
    MediaSliderComponent
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  protected readonly popularMovies: WritableSignal<PopularMovies | undefined> = signal(undefined);
  protected readonly nowPlayingMovies: WritableSignal<MoviesPlayingNow | undefined> = signal(undefined);
  protected readonly topRatedMovies: WritableSignal<TopRatedMovies | undefined> = signal(undefined);
  protected readonly upcomingMovies: WritableSignal<UpcomingMovies | undefined> = signal(undefined);

  constructor(readonly activatedRoute: ActivatedRoute, readonly progressShower: ProgressShowerService) {
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(take(1)).subscribe((data) => {
      this.popularMovies.set(data['popular']);
      this.nowPlayingMovies.set(data['nowPlaying']);
      this.topRatedMovies.set(data['topRated']);
      this.upcomingMovies.set(data['upcoming']);
      this.progressShower.hide();
    })
  }
}
