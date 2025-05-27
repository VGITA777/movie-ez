import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MovieDiscoverResult} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {
  MoviesLocalStorageCacheManagerService
} from '../../shared/data-access/movies-local-storage-cache-manager.service';
import {DISCOVER_MOVIES_CACHE_KEY, ONE_DAY_MILLIS} from '../../shared/constants';
import {getOrFetchAndCache} from '../../shared/utils/helpers';

@Injectable({
  providedIn: 'root'
})
export class DiscoverMoviesResolverService implements Resolve<MovieDiscoverResult> {

  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService, private readonly moviesLocalStorageManager: MoviesLocalStorageCacheManagerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MovieDiscoverResult | RedirectCommand> {
    this.progressShower.show('indeterminate');

    return this.moviesLocalStorageManager.get(DISCOVER_MOVIES_CACHE_KEY).pipe(
      getOrFetchAndCache(this.moviesLocalStorageManager, DISCOVER_MOVIES_CACHE_KEY, () => this.tmdb.discover.movie(), ONE_DAY_MILLIS,),
    );
  }
}
