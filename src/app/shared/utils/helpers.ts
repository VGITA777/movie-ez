import {MoviesLocalStorageCacheManagerService} from '../data-access/movies-local-storage-cache-manager.service';
import {from, mergeMap, of, take, tap} from 'rxjs';

export function getOrFetchAndCache<T>(
  cacheManager: MoviesLocalStorageCacheManagerService,
  cacheKey: string,
  fetchFn: () => Promise<T>,
  expiration: number
) {
  return mergeMap((cached: any) => {
    if (cached && cached?.expiration! < Date.now()) {
      return of(JSON.parse(cached.value) as T);
    }
    return from(fetchFn()).pipe(
      take(1),
      tap(result => cacheManager.set(cacheKey, result, expiration))
    );
  });
}
