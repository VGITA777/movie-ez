/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Routes} from '@angular/router';

export const SettingsRoutes: Routes = [
  {
    // Redirect to /error if url is /settings
    path: '',
    pathMatch: 'full',
    redirectTo: '/error',
  },
  {
    path: '',
    loadComponent: () => import('./settings.component').then(m => m.SettingsComponent),
    loadChildren: async (): Promise<Routes> => {
      return [
        {
          path: 'player',
          loadComponent: () => import('./features/settings-player/settings-player.component').then(m => m.SettingsPlayerComponent)
        }
      ]
    },
  },
  {
    path: '**',
    redirectTo: '/error'
  }
];


