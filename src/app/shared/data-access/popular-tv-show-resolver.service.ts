import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {PopularTvShows} from 'tmdb-ts';
import {TmdbService} from './tmdb.service';
import {ProgressShowerService} from '../utils/progress-shower.service';
import {finalize, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopularTvShowResolverService implements Resolve<PopularTvShows> {
  constructor(readonly tmdb: TmdbService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularTvShows | RedirectCommand> {
    this.progressShower.show('indeterminate')
    return from(this.tmdb.tvShows.popular()).pipe(
      finalize(() => {
        this.progressShower.hide()
      })
    );
  }
}
