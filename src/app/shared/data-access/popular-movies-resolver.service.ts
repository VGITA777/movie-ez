import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {PopularMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../utils/progress-shower.service';
import {TmdbService} from './tmdb.service';
import {POPULAR_MOVIES_CACHE_KEY, POPULAR_MOVIES_NAMESPACE} from '../constants';
import {CachedResolve} from '../caching/cached-resolve';
import {ExpirableSimpleCache} from '../caching/simple-cache';
import {CacheManager, LocalStorageCacheManager} from '../caching/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class PopularMoviesResolverService extends CachedResolve<PopularMovies, ExpirableSimpleCache> {

  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: CacheManager<ExpirableSimpleCache> = new LocalStorageCacheManager(POPULAR_MOVIES_NAMESPACE);
    super(localStorage, POPULAR_MOVIES_CACHE_KEY);
  }

  override fetch(): Promise<PopularMovies> {
    return this.tmdb.movies.popular();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return super.resolve(route, state);
  }
}
