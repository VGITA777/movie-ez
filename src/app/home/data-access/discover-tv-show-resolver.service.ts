import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {TvShowDiscoverResult} from 'tmdb-ts';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscoverTvShowResolverService implements Resolve<TvShowDiscoverResult> {

  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<TvShowDiscoverResult | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return from(this.tmdb.discover.tvShow());
  }
}
