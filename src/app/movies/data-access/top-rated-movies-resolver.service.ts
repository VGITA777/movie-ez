import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {TopRatedMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {TOP_RATED_MOVIES_CACHE_KEY, TOP_RATED_MOVIES_NAMESPACE} from '../../shared/constants';
import {CacheManager, LocalStorageCacheManager} from '../../shared/caching/cache-manager';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {CachedResolve} from '../../shared/caching/cached-resolve';

@Injectable({
  providedIn: 'root'
})
export class TopRatedMoviesResolverService extends CachedResolve<TopRatedMovies, ExpirableSimpleCache> {

  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: CacheManager<ExpirableSimpleCache> = new LocalStorageCacheManager(TOP_RATED_MOVIES_NAMESPACE);
    super(localStorage, TOP_RATED_MOVIES_CACHE_KEY);
  }

  override fetch(): Promise<TopRatedMovies> {
    return this.tmdb.movies.topRated();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<TopRatedMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return super.resolve(route, state);
  }
}
