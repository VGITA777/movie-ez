import {Component, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LatestMovie, MoviesPlayingNow, PopularMovies, TopRatedMovies} from 'tmdb-ts';

@Component({
  selector: 'app-movies',
  imports: [],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  protected readonly popularMovies: WritableSignal<PopularMovies | undefined> = signal(undefined);
  protected readonly nowPlayingMovies: WritableSignal<MoviesPlayingNow | undefined> = signal(undefined);
  protected readonly topRatedMovies: WritableSignal<TopRatedMovies | undefined> = signal(undefined);
  protected readonly latestMovies: WritableSignal<LatestMovie | undefined> = signal(undefined);

  constructor(readonly activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.popularMovies.set(data['popular']);
      this.nowPlayingMovies.set(data['nowPlaying']);
      this.topRatedMovies.set(data['topRated']);
      this.latestMovies.set(data['latest']);
    })
  }
}
