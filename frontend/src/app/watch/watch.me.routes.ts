import { Routes } from '@angular/router';

export const watchRoutes: Routes = [
  {
    path: 'watch',
    loadComponent: () => import('./watch.me').then((m) => m.WatchMe),
  },
];
