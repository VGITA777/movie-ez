import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MoviesPlayingNow} from 'tmdb-ts';
import {
  MoviesLocalStorageCacheManagerService
} from '../../shared/data-access/movies-local-storage-cache-manager.service';
import {NOW_PLAYING_MOVIES_CACHE_KEY, ONE_DAY_MILLIS} from '../../shared/constants';
import {getOrFetchAndCache} from '../../shared/utils/helpers';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingMoviesService implements Resolve<MoviesPlayingNow> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService, private readonly moviesLocalStorageManager: MoviesLocalStorageCacheManagerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<MoviesPlayingNow | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return this.moviesLocalStorageManager.get(NOW_PLAYING_MOVIES_CACHE_KEY).pipe(
      getOrFetchAndCache(this.moviesLocalStorageManager, NOW_PLAYING_MOVIES_CACHE_KEY, () => this.tmdb.movies.nowPlaying(), ONE_DAY_MILLIS,)
    );
  }
}
