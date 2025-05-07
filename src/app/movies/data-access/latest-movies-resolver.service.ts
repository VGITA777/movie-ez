import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {LatestMovie} from 'tmdb-ts';
import {MoviesService} from './movies.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {finalize, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LatestMoviesResolverService implements Resolve<LatestMovie> {
  constructor(readonly movieService: MoviesService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<LatestMovie | RedirectCommand> {
    return from(this.movieService.getLatest()).pipe(finalize(() => {
      this.progressShower.hide()
    }));
  }
}
