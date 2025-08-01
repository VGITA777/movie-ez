import {from, mergeMap, of, take, tap} from 'rxjs';
import {CacheManager} from '../caching/cache-manager';
import {SimpleCache} from '../caching/simple-cache';
import {environment} from '@env/environment';

export function getOrFetchAndCache<T, C extends SimpleCache<T>>(
  cacheManager: CacheManager<C>,
  cacheKey: string,
  fetchFn: () => Promise<T>,
  expiration: number
) {
  return mergeMap((cached: C | undefined) => {
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
