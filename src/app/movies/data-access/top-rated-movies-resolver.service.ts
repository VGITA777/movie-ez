import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {TopRatedMovies} from 'tmdb-ts';
import {MoviesService} from './movies.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {finalize, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopRatedMoviesResolverService implements Resolve<TopRatedMovies> {
  constructor(readonly movieService: MoviesService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<TopRatedMovies | RedirectCommand> {
    return from(this.movieService.getTopRated()).pipe(finalize(() => {
      this.progressShower.hide()
    }));
  }
}
