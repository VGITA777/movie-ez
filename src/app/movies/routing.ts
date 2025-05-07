import {Routes} from '@angular/router';
import {MoviesComponent} from './movies.component';
import {PopularMoviesResolverService} from '../shared/data-access/popular-movies-resolver.service';
import {NowPlayingMoviesService} from './data-access/now-playing-movies.service';
import {TopRatedMoviesResolverService} from './data-access/top-rated-movies-resolver.service';
import {LatestMoviesResolverService} from './data-access/latest-movies-resolver.service';

export const MoviesRoutes: Routes = [
  {
    path: '',
    component: MoviesComponent,
    resolve: {
      popular: PopularMoviesResolverService,
      nowPlaying: NowPlayingMoviesService,
      topRated: TopRatedMoviesResolverService,
      latest: LatestMoviesResolverService
    }
  }
];
