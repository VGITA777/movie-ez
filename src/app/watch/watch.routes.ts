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
    path: 'tv/:id',
    loadComponent: () => import('./features/watch-tv/watch-tv.component').then(m => m.WatchTvComponent)
  }
]
