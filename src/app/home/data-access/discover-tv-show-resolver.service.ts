import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {TvShowDiscoverResult} from 'tmdb-ts';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';
import {DISCOVER_TV_SHOWS_CACHE_KEY, DISCOVER_TV_SHOWS_NAMESPACE} from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DiscoverTvShowResolverService extends CachedResolve<TvShowDiscoverResult, ExpirableSimpleCache> {

  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage = new LocalStorageCacheManager(DISCOVER_TV_SHOWS_NAMESPACE);
    super(localStorage, DISCOVER_TV_SHOWS_CACHE_KEY);
  }

  fetch(): Promise<TvShowDiscoverResult> {
    return this.tmdb.discover.tvShow();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<TvShowDiscoverResult | RedirectCommand> {
    this.progressShower.show('indeterminate');
    return super.resolve(route, state);
  }
}
