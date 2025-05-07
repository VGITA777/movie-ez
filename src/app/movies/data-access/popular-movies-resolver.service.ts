import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot} from '@angular/router';
import {PopularMovies} from 'tmdb-ts';
import {MoviesService} from './movies.service';
import {ProgressShowerService} from '../../shared/utils/progress-shower.service';
import {finalize, from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopularMoviesResolverService implements Resolve<PopularMovies> {
  constructor(readonly movieService: MoviesService, readonly progressShower: ProgressShowerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<PopularMovies | RedirectCommand> {
    this.progressShower.show('indeterminate');
    return from(this.movieService.getPopular()).pipe(finalize(() => {
      this.progressShower.hide()
    }));
  }
}
