import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {PopularMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {finalize, from, tap} from 'rxjs';
import {TmdbService} from '../../shared/data-access/tmdb.service';

@Injectable({
  providedIn: 'root'
})
export class PopularMoviesResolverService implements Resolve<PopularMovies> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularMovies | RedirectCommand> {
    return from(this.tmdb.movies.popular()).pipe(
      tap(() => {
        this.progressShower.show('indeterminate');
      }),
      finalize(() => {
        this.progressShower.hide()
      })
    );
  }
}
