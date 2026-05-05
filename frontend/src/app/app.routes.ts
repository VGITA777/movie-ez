import { Routes } from '@angular/router';
import { homeRoutes } from '@home/home.me.routes';
import { watchRoutes } from '@watch/watch.me.routes';
import { SearchMe } from '@search/search.me';

export const routes: Routes = [
  ...homeRoutes,
  ...watchRoutes,
  {
    path: 'search',
    component: SearchMe,
  },
];
