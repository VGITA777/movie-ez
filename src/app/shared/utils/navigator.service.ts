import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  constructor(readonly router: Router) {
  }

  navigateToHome(onNavigate?: () => void): void {
    this.navigate(['/'], undefined, onNavigate);
  }

  navigateToMovies(onNavigate?: () => void): void {
    this.navigate(['/movies'], undefined, onNavigate);
  }

  navigateToTvShows(onNavigate?: () => void): void {
    this.navigate(['/tv-shows'], undefined, onNavigate);
  }

  navigateToWatchMovie(id: number, extras?: NavigationExtras, onNavigate?: () => void): void {
    this.navigate(['/watch/movie', id], extras, onNavigate);
  }

  navigateToWatchSeries(id: number, extras?: NavigationExtras, onNavigate?: () => void): void {
    this.navigate(['/watch/series', id], extras, onNavigate);
  }

  navigateToError(message?: string, errorCode?: number, onNavigate?: () => void): void {
    this.navigate(['/error'], {state: {message: message, errorCode: errorCode}}, onNavigate);
  }

  private navigate(commands: any[], extras?: NavigationExtras, onNavigate?: () => void): void {
    this.router.navigate(commands, extras).then(() => {
      if (onNavigate) {
        onNavigate();
      }
    });
  }
}
