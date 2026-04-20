import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {catchError, concatMap, from, of, take, tap} from 'rxjs';
import {ONE_DAY_MILLIS} from '@constants';
import {CacheManager} from './cache-manager';
import {SimpleCache} from './simple-cache';
import {environment} from '@env/environment';

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

function getOrFetchAndCache<T, C extends SimpleCache<T>>(
  cacheManager: CacheManager<C>,
  cacheKey: string,
  fetchFn: () => Promise<T>,
  expiration: number
) {
  return concatMap((cached: C | undefined) => {
    if (cached) {
      const value = typeof cached.value === 'string' ? JSON.parse(cached.value) : cached.value;
      // No expiration means the cache is always valid
      if (cached.expiration === undefined) {
        if (environment.isLoggingEnabled) {
          console.log(`Returning value from cache: ${cacheKey}`)
        }
        return of(value as T);
      }
      // Check if the cached value is still valid
      if (cached?.expiration > Date.now()) {
        try {
          if (environment.isLoggingEnabled) {
            console.log(`Returning value from cache: ${cacheKey}`)
          }
          return of(value as T);
        } catch (e) {
          cacheManager.clear()
          if (environment.isLoggingEnabled) {
            console.error(`Error parsing cached value for key ${cacheKey}:`, e);
          }
        }
      }
    }
    return from(fetchFn()).pipe(
      take(1),
      tap(result => cacheManager.set(cacheKey, result, expiration))
    );
  });
}
