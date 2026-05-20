import { Routes } from '@angular/router';
import { playlistContentsRoutes } from '@playlists/features/playlist-contents/playlist-contents.me.routes';

export const playlistsRoutes: Routes = [
  {
    path: 'playlists',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./playlists.me').then((m) => m.PlaylistsMe),
      },
      ...playlistContentsRoutes,
    ],
  },
];
