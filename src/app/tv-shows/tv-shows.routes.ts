import {Routes} from '@angular/router';

export const TvShowsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tv-shows.component').then(m => m.TvShowsComponent)
  }
];
