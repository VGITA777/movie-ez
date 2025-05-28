import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MovieDiscoverResult} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {DISCOVER_MOVIES_CACHE_KEY, DISCOVER_MOVIES_NAMESPACE} from '../../shared/constants';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';
import {CachedResolve} from '../../shared/caching/cached-resolve';

@Injectable({
  providedIn: 'root'
})
export class DiscoverMoviesResolverService extends CachedResolve<MovieDiscoverResult, ExpirableSimpleCache> {

  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage = new LocalStorageCacheManager(DISCOVER_MOVIES_NAMESPACE);
    super(localStorage, DISCOVER_MOVIES_CACHE_KEY);
  }

  override fetch(): Promise<MovieDiscoverResult> {
    return this.tmdb.discover.movie();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MovieDiscoverResult | RedirectCommand> {
    this.progressShower.show('indeterminate');
    return super.resolve(route, state);
  }
}
