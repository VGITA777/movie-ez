import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RedirectCommand,
  Router,
  Routes,
} from '@angular/router';
import { watchPageQueryParams } from './watch.me';
import { z } from 'zod';
import { GenericRouteData } from '../app';

const watchPageMediaTypeGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | RedirectCommand => {
  const router: Router = inject(Router);
  const validationResult = watchPageQueryParams.safeParse(route.queryParams);

  if (!validationResult.success) {
    console.debug('Query parameter validation failed: ', z.treeifyError(validationResult.error));
    return new RedirectCommand(router.parseUrl('/'), {
      state: {
        messages: [{ message: 'Invalid query parameters', type: 'error' } as GenericRouteData],
      },
    });
  }

  return true;
};

export const watchRoutes: Routes = [
  {
    path: 'watch',
    loadComponent: () => import('./watch.me').then((m) => m.WatchMe),
    canActivate: [watchPageMediaTypeGuard],
    resolve: {},
  },
];
