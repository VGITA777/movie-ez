import { ActivatedRouteSnapshot, RedirectCommand, Router, Routes, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import { catchError, map, Observable, of } from 'rxjs';
import { UUID_REGEX } from '@shared/constants';

function playlistIdGuard(
  route: ActivatedRouteSnapshot,
): Observable<boolean | RedirectCommand> | RedirectCommand {
  const router: Router = inject(Router);
  const userLocalPlaylistService: UserLocalPlaylistService = inject(UserLocalPlaylistService);
  const redirectToPlaylist: UrlTree = router.createUrlTree(['/playlists']);
  const id: string | null = route.paramMap.get('playlistId');

  if (!id || !UUID_REGEX.test(id)) {
    return new RedirectCommand(redirectToPlaylist);
  }

  return userLocalPlaylistService.getPlaylist(id).pipe(
    map((playlist) => {
      if (!playlist) {
        return new RedirectCommand(redirectToPlaylist);
      }
      return true;
    }),
    catchError(() => {
      return of(new RedirectCommand(redirectToPlaylist));
    }),
  );
}

export const playlistContentsRoutes: Routes = [
  {
    path: ':playlistId',
    loadComponent: () => import('./playlist-contents.me').then((m) => m.PlaylistContentsMe),
    canActivate: [playlistIdGuard],
  },
];
