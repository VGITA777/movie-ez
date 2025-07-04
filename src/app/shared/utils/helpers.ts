import {from, mergeMap, of, take, tap} from 'rxjs';
import {CacheManager} from '../caching/cache-manager';
import {SimpleCache} from '../caching/simple-cache';

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
        console.log(`Returning value from cache: ${cacheKey}`)
        return of(value as T);
      }
      // Check if the cached value is still valid
      if (cached?.expiration > Date.now()) {
        try {
          console.log(`Returning value from cache: ${cacheKey}`)
          return of(value as T);
        } catch (e) {
          cacheManager.clear()
          console.log(`Error parsing cached value for key ${cacheKey}:`, e);
          console.log(`Cached value:`, cached.value);
        }
      }
    }
    return from(fetchFn()).pipe(
      take(1),
      tap(result => cacheManager.set(cacheKey, result, expiration))
    );
  });
}
