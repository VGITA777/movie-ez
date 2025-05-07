import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {MoviesPlayingNow} from 'tmdb-ts';
import {MoviesService} from './movies.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {finalize, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingMoviesService implements Resolve<MoviesPlayingNow> {
  constructor(readonly movieService: MoviesService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MoviesPlayingNow | RedirectCommand> {
    return from(this.movieService.getNowPlaying()).pipe(finalize(() => {
      this.progressShower.hide()
    }));
  }
}
