import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  MaybeAsync,
  RedirectCommand,
  Resolve,
  Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { MediaDetailsModel, MediaType } from '@shared/models';
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
        errors: [{ isError: true, message: 'Invalid query parameters' } as GenericRouteData],
      },
    });
  }
  const mediaType: MediaType = validationResult.data.type;

  if (mediaType === 'person') {
    console.debug('Media type of "person" is currently not supported');
    return new RedirectCommand(router.parseUrl('/'), {
      state: {
        errors: [
          { isError: true, message: `Invalid Media Type of '${mediaType}'` } as GenericRouteData,
        ],
      },
    });
  }

  return true;
};

export class MediaDetailsResolver implements Resolve<MediaDetailsModel> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): MaybeAsync<MediaDetailsModel | RedirectCommand> {
    const router: Router = inject(Router);
    return new RedirectCommand(router.parseUrl('/'));
  }
}

export class MediaImageResolver implements Resolve<MediaDetailsModel> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): MaybeAsync<MediaDetailsModel | RedirectCommand> {
    const router: Router = inject(Router);
    return new RedirectCommand(router.parseUrl('/'));
  }
}

export const watchRoutes: Routes = [
  {
    path: 'watch',
    loadComponent: () => import('./watch.me').then((m) => m.WatchMe),
    canActivate: [watchPageMediaTypeGuard],
    resolve: {},
  },
];
