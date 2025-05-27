import {Injectable} from '@angular/core';
import {LocalStorageCacheManager} from '../interface/cache-manager';
import {from, Observable} from 'rxjs';
import {SimpleCache} from '../interface/simple-cache';
import {MOVIES_CACHE_NAMESPACE} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class MoviesLocalStorageCacheManagerService {
  private readonly cacheManger: LocalStorageCacheManager = new LocalStorageCacheManager(MOVIES_CACHE_NAMESPACE);

  set(key: string, value: any, expiration: number): Observable<SimpleCache> {
    return from(this.cacheManger.set(key, JSON.stringify(value), expiration))
  }

  get(key: string): Observable<SimpleCache | undefined> {
    return from(this.cacheManger.get(key));
  }

  delete(key: string): Observable<void> {
    return from(this.cacheManger.delete(key));
  }

  clear(): Observable<void> {
    return from(this.cacheManger.clear());
  }

  has(key: string): Observable<boolean> {
    return from(this.cacheManger.has(key));
  }

  values(): Observable<any[]> {
    return from(this.cacheManger.values());
  }

  keys(): Observable<any[]> {
    return from(this.cacheManger.keys());
  }
}
