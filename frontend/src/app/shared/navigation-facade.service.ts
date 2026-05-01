import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MediaType } from '@shared/models';
import { GenericRouteData } from '../app';

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
}
