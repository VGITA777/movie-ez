import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
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
export class MoviesComponent implements OnInit {

  protected readonly popularMovies: WritableSignal<PopularMovies> = signal({} as PopularMovies);
  protected readonly nowPlayingMovies: WritableSignal<MoviesPlayingNow> = signal({} as MoviesPlayingNow);
  protected readonly topRatedMovies: WritableSignal<TopRatedMovies> = signal({} as TopRatedMovies);
  protected readonly upcomingMovies: WritableSignal<UpcomingMovies> = signal({} as UpcomingMovies);

  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

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
