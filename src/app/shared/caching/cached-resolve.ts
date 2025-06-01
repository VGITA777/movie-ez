import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {catchError, from, tap} from 'rxjs';
import {getOrFetchAndCache} from '../utils/helpers';
import {ONE_DAY_MILLIS} from '../constants';
import {CacheManager} from './cache-manager';
import {SimpleCache} from './simple-cache';

export abstract class CachedResolve<T, C extends SimpleCache<T>> implements Resolve<T> {
  protected constructor(private readonly cacheManager: CacheManager<C>, private readonly key: string) {
  }

  abstract fetch(): Promise<T>

  onFinish?(err?: any): void;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<RedirectCommand | T> {
    return from(this.cacheManager.get(this.key)).pipe(
      getOrFetchAndCache<T, C>(
        this.cacheManager,
        this.key,
        () => this.fetch(),
        Date.now() + ONE_DAY_MILLIS
      ),
      tap(() => {
        this.onFinish?.()
      }),
      catchError(err => {
        this.onFinish?.(err);
        return Promise.reject(err);
      })
    )
  }
}
