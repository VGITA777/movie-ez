import { Routes } from '@angular/router';
import { homeRoutes } from '@home/home.me.routes';
import { watchRoutes } from '@watch/watch.me.routes';
import { notFoundRoutes } from '@notfound/not-found.me.routes';

export const routes: Routes = [
  ...homeRoutes,
  ...watchRoutes,
  ...notFoundRoutes,
  { path: '**', redirectTo: '/error' },
];
