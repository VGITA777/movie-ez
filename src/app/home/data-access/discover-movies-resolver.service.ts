import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MovieDiscoverResult} from 'tmdb-ts';
import {from} from 'rxjs';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';

@Injectable({
  providedIn: 'root'
})
export class DiscoverMoviesResolverService implements Resolve<MovieDiscoverResult> {

  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MovieDiscoverResult | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return from(this.tmdb.discover.movie());
  }
}
