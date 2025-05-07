import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: async () => {
      const m = await import('./home/home.routes');
      return m.HomeRoutes;
    }
  },
  {
    path: 'watch',
    loadChildren: async () => {
      const m = await import('./watch/watch.routes');
      return m.WatchRoutes;
    }
  },
  {
    path: 'search',
    loadChildren: async () => {
      const m = await import('./search/search.routes');
      return m.SearchRoutes;
    }
  },
  {
    path: 'movies',
    loadChildren: async () => {
      const m = await import('./movies/movies.routes');
      return m.MoviesRoutes;
    }
  },
  {
    path: 'tv-shows',
    loadChildren: async () => {
      const m = await import('./tv-shows/tv-shows.routes');
      return m.TvShowsRoutes;
    }
  },
  {
    path: 'settings',
    loadChildren: async () => {
      const m = await import('./settings/settings.routes');
      return m.SettingsRoutes;
    }
  },
  {
    path: 'error',
    loadChildren: async () => {
      const m = await import('./error/error.routes');
      return m.ErrorRoutes;
    }
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
