import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {PopularTvShows} from 'tmdb-ts';
import {TmdbService} from './tmdb.service';
import {ProgressShowerService} from '../utils/progress-shower.service';
import {CachedResolve} from '../caching/cached-resolve';
import {ExpirableSimpleCache} from '../caching/simple-cache';
import {CacheManager, LocalStorageCacheManager} from '../caching/cache-manager';
import {POPULAR_TV_SHOWS_CACHE_KEY, POPULAR_TV_SHOWS_NAMESPACE} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PopularTvShowResolverService extends CachedResolve<PopularTvShows, ExpirableSimpleCache> {
  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: CacheManager<ExpirableSimpleCache> = new LocalStorageCacheManager(POPULAR_TV_SHOWS_NAMESPACE);
    super(localStorage, POPULAR_TV_SHOWS_CACHE_KEY);
  }

  override fetch(): Promise<PopularTvShows> {
    return this.tmdb.tvShows.popular();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularTvShows | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return super.resolve(route, state);
  }
}
