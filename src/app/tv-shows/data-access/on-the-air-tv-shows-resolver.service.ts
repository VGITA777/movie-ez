import {inject, Injectable} from '@angular/core';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {OnTheAir} from 'tmdb-ts';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';
import {ON_THE_AIR_TV_SHOWS_CACHE_KEY, ON_THE_AIR_TV_SHOWS_NAMESPACE} from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class OnTheAirTvShowsResolverService extends CachedResolve<OnTheAir, ExpirableSimpleCache<OnTheAir>> {
  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: LocalStorageCacheManager<OnTheAir> = new LocalStorageCacheManager(ON_THE_AIR_TV_SHOWS_NAMESPACE);
    super(localStorage, ON_THE_AIR_TV_SHOWS_CACHE_KEY);
  }

  override fetch(): Promise<OnTheAir> {
    return this.tmdb.tvShows.onTheAir();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<RedirectCommand | OnTheAir> {
    this.progressShower.show('indeterminate');
    return super.resolve(route, state);
  }
}
