import { Routes } from '@angular/router';
import { homeRoutes } from '@home/home.me.routes';
import { watchRoutes } from './watch/watch.me.routes';

export const routes: Routes = [...homeRoutes, ...watchRoutes];
