import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {PopularMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../utils/progress-shower.service';
import {finalize, from} from 'rxjs';
import {TmdbService} from './tmdb.service';

@Injectable({
  providedIn: 'root'
})
export class PopularMoviesResolverService implements Resolve<PopularMovies> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return from(this.tmdb.movies.popular()).pipe(
      finalize(() => {
        this.progressShower.hide()
      })
    );
  }
}
