import {Routes} from '@angular/router';

export const SearchRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./search.component').then(m => m.SearchComponent)
  }
];
