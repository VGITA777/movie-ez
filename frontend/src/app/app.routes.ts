import { Routes } from '@angular/router';
import { homeRoutes } from '@home/home.me.routes';
import { watchRoutes } from '@watch/watch.me.routes';
import { notFoundRoutes } from '@notfound/not-found.me.routes';
import { playlistsRoutes } from '@playlists/playlists.me.routes';

export const routes: Routes = [
  ...homeRoutes,
  ...watchRoutes,
  ...playlistsRoutes,
  ...notFoundRoutes,
  { path: '**', redirectTo: '/error' },
];
