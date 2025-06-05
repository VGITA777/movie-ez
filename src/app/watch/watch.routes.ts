import {Routes} from '@angular/router';

export const WatchRoutes: Routes = [
  // Redirect to error if url is /watch
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/error'
  },
  {
    path: '',
    loadComponent: () => import('./watch.component').then(m => m.WatchComponent),
    loadChildren: async (): Promise<Routes> => [
      {
        path: 'movie/:id',
        loadChildren: () => MovieWatchRoutes
      },
      {
        path: 'tv/:id',
        loadChildren: () => TvWatchRoutes
      }
    ]
  },
]

export const MovieWatchRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => [
      {
        path: '',
        outlet: 'mediaWatch',
        pathMatch: 'full',
        loadComponent: () => import('./features/watch-movie/watch-movie.component').then(m => m.WatchMovieComponent)
      },
      {
        path: '',
        outlet: 'mediaDescription',
        pathMatch: 'full',
        loadComponent: () => import('./features/watch-movie-description/watch-movie-description.component').then(m => m.WatchMovieDescriptionComponent)
      }
    ]
  }
]

export const TvWatchRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => [
      {
        path: '',
        outlet: 'mediaWatch',
        pathMatch: 'full',
        loadComponent: () => import('./features/watch-tv/watch-tv.component').then(m => m.WatchTvComponent)
      },
      {
        path: '',
        outlet: 'mediaDescription',
        pathMatch: 'full',
        loadComponent: () => import('./features/watch-tv-description/watch-tv-description.component').then(m => m.WatchTvDescriptionComponent)
      }
    ]
  }
]
