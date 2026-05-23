import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
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
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { auditTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    HlmNavigationMenuImports,
    NgTemplateOutlet,
  ],
  templateUrl: './navigation.me.html',
  styleUrl: './navigation.me.css',
  providers: [provideIcons({ lucideSearch, lucideUser, lucideLogIn })],
})
export class NavigationMe implements OnInit {
  private readonly _showBg: WritableSignal<boolean> = signal(false);
  private readonly searchDialog: Signal<HlmDialog> = viewChild.required('searchDialog');
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly authService: AuthFacadeService = inject(AuthFacadeService);
  protected readonly showBg: Signal<boolean> = this._showBg.asReadonly();

  public readonly threshold: InputSignal<number> = input(250);

  constructor() {
    effect(() => {
      console.debug(`Is authenticated: ${this.authService.isAuthenticated()}`);
    });
  }

  public ngOnInit(): void {
    fromEvent(window, 'scroll')
      .pipe(
        auditTime(100),
        map(() => window.scrollY >= this.threshold()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((showBg) => {
        this._showBg.set(showBg);
      });
  }

  protected closeSearchDialog(): void {
    this.searchDialog().close();
  }

  protected login(): void {
    this.authService.login(window.location.pathname);
  }

  protected logout(): void {
    this.authService.logout();
  }
}
