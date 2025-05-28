import {from, mergeMap, of, take, tap} from 'rxjs';
import {CacheManager} from '../caching/cache-manager';
import {SimpleCache} from '../caching/simple-cache';

export function getOrFetchAndCache<T, C extends SimpleCache>(
  cacheManager: CacheManager<C>,
  cacheKey: string,
  fetchFn: () => Promise<T>,
  expiration: number
) {
  return mergeMap((cached: C | undefined) => {
    if (cached && cached?.expiration !== undefined && cached?.expiration < Date.now()) {
      try {
        const value = typeof cached.value === 'string' ? JSON.parse(cached.value) : cached.value;
        return of(value as T);
      } catch (e) {
        cacheManager.clear()
        console.log(`Error parsing cached value for key ${cacheKey}:`, e);
        console.log(`Cached value:`, cached.value);
      }
    }
    return from(fetchFn()).pipe(
      take(1),
      tap(result => cacheManager.set(cacheKey, result, expiration))
    );
  });
}
