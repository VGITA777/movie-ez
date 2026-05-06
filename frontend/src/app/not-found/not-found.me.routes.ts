import { Routes } from '@angular/router';

export const notFoundRoutes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./not-found.me').then((m) => m.NotFoundMe),
  },
];
