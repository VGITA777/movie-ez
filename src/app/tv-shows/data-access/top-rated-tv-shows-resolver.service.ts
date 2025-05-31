import {inject, Injectable} from '@angular/core';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {TopRatedTvShows} from 'tmdb-ts';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';
import {TOP_RATED_TV_SHOWS_CACHE_KEY, TOP_RATED_TV_SHOWS_NAMESPACE} from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TopRatedTvShowsResolverService extends CachedResolve<TopRatedTvShows, ExpirableSimpleCache> {
  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage = new LocalStorageCacheManager(TOP_RATED_TV_SHOWS_NAMESPACE);
    super(localStorage, TOP_RATED_TV_SHOWS_CACHE_KEY);
  }

  override fetch(): Promise<TopRatedTvShows> {
    return this.tmdb.tvShows.topRated();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<RedirectCommand | TopRatedTvShows> {
    this.progressShower.show('indeterminate');
    return super.resolve(route, state);
  }
}
