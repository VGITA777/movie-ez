import {
  Component,
  effect,
  HostListener,
  inject,
  input,
  InputSignal,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideLogIn, lucideSearch, lucideUser } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { HlmDialog, HlmDialogImports } from '@spartan-ng/helm/dialog';
import { SearchMe } from '@search/search.me';
import { RouterLink } from '@angular/router';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

@Component({
  selector: 'me-navigation',
  imports: [
    HlmInputGroupImports,
    HlmIconImports,
    HlmAvatarImports,
    NgClass,
    HlmDialogImports,
    SearchMe,
    RouterLink,
    HlmButtonImports,
    HlmTooltipImports,
    HlmNavigationMenuImports,
    NgTemplateOutlet,
  ],
  templateUrl: './navigation.me.html',
  styleUrl: './navigation.me.css',
  providers: [provideIcons({ lucideSearch, lucideUser, lucideLogIn })],
})
export class NavigationMe {
  private readonly _showBg: WritableSignal<boolean> = signal(false);
  private readonly searchDialog: Signal<HlmDialog> = viewChild.required('searchDialog');

  protected readonly authService: AuthFacadeService = inject(AuthFacadeService);
  protected readonly showBg: Signal<boolean> = this._showBg.asReadonly();

  public readonly threshold: InputSignal<number> = input(250);

  constructor() {
    effect(() => {
      console.debug(`Is authenticated: ${this.authService.isAuthenticated()}`);
    });
  }

  protected closeSearchDialog(): void {
    this.searchDialog().close();
  }

  protected login(): void {
    this.authService.login();
  }

  protected logout(): void {
    this.authService.logout();
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this._showBg.set(window.scrollY >= this.threshold());
  }
}
