import {Routes} from '@angular/router';
import {ErrorRoutes} from './error/routing';
import {WatchRoutes} from './watch/routing';
import {HomeRoutes} from './home/routing';

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
