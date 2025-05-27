import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {TopRatedMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {
  MoviesLocalStorageCacheManagerService
} from '../../shared/data-access/movies-local-storage-cache-manager.service';
import {ONE_DAY_MILLIS, TOP_RATED_MOVIES_CACHE_KEY} from '../../shared/constants';
import {getOrFetchAndCache} from '../../shared/utils/helpers';

@Injectable({
  providedIn: 'root'
})
export class TopRatedMoviesResolverService implements Resolve<TopRatedMovies> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService, private readonly moviesLocalStorageManager: MoviesLocalStorageCacheManagerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<TopRatedMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return this.moviesLocalStorageManager.get(TOP_RATED_MOVIES_CACHE_KEY).pipe(
      getOrFetchAndCache(this.moviesLocalStorageManager, TOP_RATED_MOVIES_CACHE_KEY, () => this.tmdb.movies.topRated(), ONE_DAY_MILLIS,)
    );
  }
}
