import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.routes').then(m => m.HomeRoutes)
  },
  {
    path: 'watch',
    loadChildren: () => import('./watch/watch.routes').then(m => m.WatchRoutes)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.routes').then(m => m.SearchRoutes)
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes').then(m => m.MoviesRoutes)
  },
  {
    path: 'tv-shows',
    loadChildren: () => import('./tv-shows/tv-shows.routes').then(m => m.TvShowsRoutes)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then(m => m.SettingsRoutes)
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.routes').then(m => m.ErrorRoutes)
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
