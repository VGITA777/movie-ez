import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {UpcomingMovies} from 'tmdb-ts';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {UPCOMING_MOVIES_CACHE_KEY, UPCOMING_MOVIES_NAMESPACE} from '../../shared/constants';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {LocalStorageCacheManager} from '../../shared/caching/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class UpcomingMoviesResolverService extends CachedResolve<UpcomingMovies, ExpirableSimpleCache<UpcomingMovies>> {

  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: LocalStorageCacheManager<UpcomingMovies> = new LocalStorageCacheManager(UPCOMING_MOVIES_NAMESPACE);
    super(localStorage, UPCOMING_MOVIES_CACHE_KEY);
  }

  override fetch(): Promise<UpcomingMovies> {
    return this.tmdb.movies.upcoming();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<UpcomingMovies | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return super.resolve(route, state);
  }
}
