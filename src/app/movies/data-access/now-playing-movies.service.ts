import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {finalize, from, tap} from 'rxjs';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MoviesPlayingNow} from 'tmdb-ts';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingMoviesService implements Resolve<MoviesPlayingNow> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MoviesPlayingNow | RedirectCommand> {
    return from(this.tmdb.movies.nowPlaying()).pipe(
      tap(() => {
        this.progressShower.show('indeterminate');
      }),
      finalize(() => {
        this.progressShower.hide()
      })
    );
  }
}
