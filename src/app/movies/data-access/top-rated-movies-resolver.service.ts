import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {TopRatedMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {from} from 'rxjs';
import {TmdbService} from '../../shared/data-access/tmdb.service';

@Injectable({
  providedIn: 'root'
})
export class TopRatedMoviesResolverService implements Resolve<TopRatedMovies> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<TopRatedMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return from(this.tmdb.movies.topRated());
  }
}
