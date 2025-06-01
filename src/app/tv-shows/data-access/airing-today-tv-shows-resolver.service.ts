import {inject, Injectable} from '@angular/core';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {TvShowsAiringToday} from 'tmdb-ts';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';
import {AIRING_TODAY_TV_SHOWS_CACHE_KEY, AIRING_TODAY_TV_SHOWS_NAMESPACE} from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AiringTodayTvShowsResolverService extends CachedResolve<TvShowsAiringToday, ExpirableSimpleCache<TvShowsAiringToday>> {
  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: LocalStorageCacheManager<TvShowsAiringToday> = new LocalStorageCacheManager(AIRING_TODAY_TV_SHOWS_NAMESPACE);
    super(localStorage, AIRING_TODAY_TV_SHOWS_CACHE_KEY);
  }

  override fetch(): Promise<TvShowsAiringToday> {
    return this.tmdb.tvShows.airingToday();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<RedirectCommand | TvShowsAiringToday> {
    this.progressShower.show('indeterminate');
    return super.resolve(route, state);
  }
}
