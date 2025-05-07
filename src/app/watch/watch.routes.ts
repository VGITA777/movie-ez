import {Routes} from '@angular/router';

export const WatchRoutes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/watch-movie/watch-movie.component').then(m => m.WatchMovieComponent)
  },
  {
    path: 'series/:id',
    loadComponent: () => import('./features/watch-series/watch-series.component').then(m => m.WatchSeriesComponent)
  }
]
