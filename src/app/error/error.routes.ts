import {Routes} from '@angular/router';

export const ErrorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./error.component').then(m => m.ErrorComponent)
  }
]
