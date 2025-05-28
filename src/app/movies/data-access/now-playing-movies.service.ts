import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, RouterStateSnapshot} from '@angular/router';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MoviesPlayingNow} from 'tmdb-ts';
import {NOW_PLAYING_MOVIES_CACHE_KEY, NOW_PLAYING_MOVIES_NAMESPACE} from '../../shared/constants';
import {CachedResolve} from '../../shared/caching/cached-resolve';
import {ExpirableSimpleCache} from '../../shared/caching/simple-cache';
import {CacheManager, LocalStorageCacheManager} from '../../shared/caching/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingMoviesService extends CachedResolve<MoviesPlayingNow, ExpirableSimpleCache> {
  private readonly tmdb: TmdbService = inject(TmdbService);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  constructor() {
    const localStorage: CacheManager<ExpirableSimpleCache> = new LocalStorageCacheManager(NOW_PLAYING_MOVIES_NAMESPACE);
    super(localStorage, NOW_PLAYING_MOVIES_CACHE_KEY);
  }

  override fetch(): Promise<MoviesPlayingNow> {
    return this.tmdb.movies.nowPlaying();
  }

  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MoviesPlayingNow | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return super.resolve(route, state);
  }
}
