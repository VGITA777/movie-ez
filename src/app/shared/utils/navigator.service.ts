import {inject, Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {MediaLike} from '../ui/media-slider/media-slider.component';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  readonly router: Router = inject(Router);

  navigateToHome(onNavigate?: () => void): void {
    this.navigate(['/'], undefined, onNavigate);
  }

  navigateToSearch(onNavigate?: () => void): void {
    this.navigate(['search'], undefined, onNavigate);
  }

  navigateToMovies(onNavigate?: () => void): void {
    this.navigate(['movies'], undefined, onNavigate);
  }

  navigateToTvShows(onNavigate?: () => void): void {
    this.navigate(['tv-shows'], undefined, onNavigate);
  }

  navigateToWatch(media: MediaLike, extras?: NavigationExtras, onNavigate?: () => void): void {
    if ('first_air_date' in media) {
      this.navigateToWatchSeries(media.id, extras, onNavigate);
      return;
    }
    this.navigateToWatchMovie(media.id, extras, onNavigate);
  }

  navigateToWatchMovie(id: number, extras?: NavigationExtras, onNavigate?: () => void): void {
    this.navigate(['watch', 'movie', id], extras, onNavigate);
  }

  navigateToWatchSeries(id: number, extras?: NavigationExtras, onNavigate?: () => void): void {
    this.navigate(['watch', 'tv', id], extras, onNavigate);
  }

  navigateToSettingsPlayer(extras?: NavigationExtras, onNavigate?: () => void): void {
    this.navigate(['settings', 'player'], extras, onNavigate);
  }

  navigateToError(message?: string, errorCode?: number, onNavigate?: () => void): void {
    this.navigate(['error'], {state: {message: message, errorCode: errorCode}}, onNavigate);
  }

  private navigate(commands: any[], extras?: NavigationExtras, onNavigate?: () => void): void {
    this.router.navigate(commands, extras).then(() => {
      if (onNavigate) {
        onNavigate();
      }
    });
  }
}

export abstract class WatchNavigationHandler {
  protected readonly navigator: NavigatorService = inject(NavigatorService);

  handleNavigation(media: MediaLike, extras?: NavigationExtras, onNavigate?: () => void): void {
    this.navigator.navigateToWatch(media, extras, onNavigate);
  }
}
