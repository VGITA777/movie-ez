import {Routes} from '@angular/router';
import {DiscoverMoviesResolverService} from './data-access/discover-movies-resolver.service';
import {DiscoverTvShowResolverService} from './data-access/discover-tv-show-resolver.service';
import {PopularMoviesResolverService} from '../shared/data-access/popular-movies-resolver.service';
import {PopularTvShowResolverService} from '../shared/data-access/popular-tv-show-resolver.service';

export const HomeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
    resolve: {
      discoverMovies: DiscoverMoviesResolverService,
      discoverTvShows: DiscoverTvShowResolverService,
      popularMovies: PopularMoviesResolverService,
      popularTvShows: PopularTvShowResolverService
    }
  }
];
