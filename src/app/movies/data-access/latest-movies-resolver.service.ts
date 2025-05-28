import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {LatestMovie} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {LATEST_MOVIES_CACHE_KEY, LATEST_MOVIES_NAMESPACE} from '../../shared/constants';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class LatestMoviesResolverService extends CachedResolve<LatestMovie, ExpirableSimpleCache> {

  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage = new LocalStorageCacheManager(LATEST_MOVIES_NAMESPACE);
    super(localStorage, LATEST_MOVIES_CACHE_KEY);
  }

  override fetch(): Promise<LatestMovie> {
    return this.tmdb.movies.latest();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<LatestMovie | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return super.resolve(route, state);
  }
}
