import { Routes } from '@angular/router';

export const playlistsRoutes: Routes = [
  {
    path: 'playlists',
    loadComponent: () => import('./playlists.me').then((m) => m.PlaylistsMe),
  },
];
