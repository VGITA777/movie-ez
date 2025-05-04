import {Routes} from '@angular/router';
import {ErrorRoutes} from './error/routing';
import {WatchRoutes} from './watch/routing';
import {HomeRoutes} from './home/routing';
import {TvShowsRoutes} from './tv-shows/routing';
import {MoviesRoutes} from './movies/routing';

export const routes: Routes = [
  {
    path: '',
    children: [
      ...HomeRoutes
    ]
  },
  {
    path: 'watch',
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
      },
      ...WatchRoutes
    ]
  },
  {
    path: 'movies',
    children: [
      ...MoviesRoutes
    ]
  },
  {
    path: 'tv-shows',
    children: [
      ...TvShowsRoutes
    ]
  },
  {
    path: 'error',
    children: [
      ...ErrorRoutes
    ]
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
