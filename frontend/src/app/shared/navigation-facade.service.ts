import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MediaType } from '@shared/models';
import { GenericRouteData } from '../app';

@Injectable({
  providedIn: 'root',
})
export class NavigationFacade {
  private readonly router: Router = inject(Router);

  public navigateToHomePage(input: {
    messages?: { messages?: GenericRouteData[] };
    onNavigate?: () => void;
  }): void {
    this.router
      .navigate(['/'], {
        state: {
          messages: input.messages?.messages ?? [],
        },
      })
      .then(() => input?.onNavigate?.());
  }

  public navigateToWatchPage(input: {
    mediaType: MediaType;
    mediaId: number;
    season?: number;
    episode?: number;
    onNavigate?: () => void;
  }): void {
    const queryParams: Record<string, string | number | undefined> = {
      type: input.mediaType,
      id: input.mediaId,
      season: input.season,
      episode: input.episode,
    };
    this.router.navigate(['/watch'], { queryParams }).then(() => input?.onNavigate?.());
  }
}
