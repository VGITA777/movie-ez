import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {PopularMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../utils/progress-shower.service';
import {TmdbService} from './tmdb.service';
import {ONE_DAY_MILLIS, POPULAR_MOVIES_CACHE_KEY} from '../constants';
import {MoviesLocalStorageCacheManagerService} from './movies-local-storage-cache-manager.service';
import {getOrFetchAndCache} from '../utils/helpers';

@Injectable({
  providedIn: 'root'
})
export class PopularMoviesResolverService implements Resolve<PopularMovies> {

  private readonly moviesLocalStorageManager: MoviesLocalStorageCacheManagerService = inject(MoviesLocalStorageCacheManagerService);

  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return this.moviesLocalStorageManager.get(POPULAR_MOVIES_CACHE_KEY).pipe(
      getOrFetchAndCache<PopularMovies>(this.moviesLocalStorageManager, POPULAR_MOVIES_CACHE_KEY, () => this.tmdb.movies.popular(), ONE_DAY_MILLIS)
    );
  }
}
