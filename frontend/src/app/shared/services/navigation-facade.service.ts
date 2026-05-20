import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GenericRouteData } from '@app/app';
import { MediaType } from '@shared/models';
import { UUID_REGEX } from '@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class NavigationFacade {
  private readonly router: Router = inject(Router);

  public navigateToHomePage(input?: {
    messages?: GenericRouteData[];
    extras?: NavigationExtras;
    onNavigate?: () => void;
  }): void {
    this.router
      .navigate(['/'], {
        ...input?.extras,
        state: {
          messages: input?.messages ?? [],
        },
      })
      .then(() => input?.onNavigate?.());
  }

  public navigateToWatchPage(input: {
    mediaType: MediaType;
    mediaId: number;
    messages?: GenericRouteData[];
    season?: number;
    episode?: number;
    extras?: NavigationExtras;
    onNavigate?: () => void;
  }): void {
    const queryParams: Record<string, string | number | undefined> = {
      type: input.mediaType,
      id: input.mediaId,
      season: input.season,
      episode: input.episode,
    };
    this.router
      .navigate(['/watch'], {
        ...input?.extras,
        queryParams: queryParams,
        state: {
          messages: input?.messages ?? [],
        },
      })
      .then(() => input?.onNavigate?.());
  }

  public navigateToPlaylistsPage(input?: {
    messages?: GenericRouteData[];
    extras?: NavigationExtras;
    onNavigate?: () => void;
  }): void {
    this.router
      .navigate(['/playlists'], {
        ...input?.extras,
        state: {
          messages: input?.messages ?? [],
        },
      })
      .then(() => input?.onNavigate?.());
  }

  navigateToPlaylistPage(
    id: string,
    input?: {
      messages?: GenericRouteData[];
      extras?: NavigationExtras;
      onNavigate?: () => void;
    },
  ): void {
    const checkedId: string = id.trim();

    if (checkedId.length === 0 || !UUID_REGEX.test(checkedId)) {
      console.warn(`Invalid playlist ID: ${id}`);
      return;
    }

    this.router
      .navigate([`/playlists/${checkedId}`], {
        ...input?.extras,
        state: {
          messages: input?.messages ?? [],
        },
      })
      .then(() => input?.onNavigate?.());
  }
}
