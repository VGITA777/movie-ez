import {Routes} from '@angular/router';
import {PopularMoviesResolverService} from '../shared/data-access/popular-movies-resolver.service';
import {NowPlayingMoviesService} from './data-access/now-playing-movies.service';
import {TopRatedMoviesResolverService} from './data-access/top-rated-movies-resolver.service';
import {UpcomingMoviesResolverService} from './data-access/upcoming-movies-resolver.service';

export const MoviesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./movies.component').then(m => m.MoviesComponent),
    resolve: {
      popular: PopularMoviesResolverService,
      nowPlaying: NowPlayingMoviesService,
      topRated: TopRatedMoviesResolverService,
      upcoming: UpcomingMoviesResolverService,
    }
  }
];
