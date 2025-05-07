import {Routes} from '@angular/router';

export const SettingsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'player',
    pathMatch: 'full'
  },
  {
    path: 'player',
    loadComponent: () => import('./features/settings-player/settings-player.component').then(m => m.SettingsPlayerComponent)
  }
];
