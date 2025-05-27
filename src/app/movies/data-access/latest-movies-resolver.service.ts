import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {LatestMovie} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {LATEST_MOVIES_CACHE_KEY, ONE_DAY_MILLIS} from '../../shared/constants';
import {
  MoviesLocalStorageCacheManagerService
} from '../../shared/data-access/movies-local-storage-cache-manager.service';
import {getOrFetchAndCache} from '../../shared/utils/helpers';

@Injectable({
  providedIn: 'root'
})
export class LatestMoviesResolverService implements Resolve<LatestMovie> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService, private readonly moviesLocalStorageManager: MoviesLocalStorageCacheManagerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<LatestMovie | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return this.moviesLocalStorageManager.get(LATEST_MOVIES_CACHE_KEY).pipe(
      getOrFetchAndCache(this.moviesLocalStorageManager, LATEST_MOVIES_CACHE_KEY, () => this.tmdb.movies.latest(), ONE_DAY_MILLIS,)
    );
  }
}
