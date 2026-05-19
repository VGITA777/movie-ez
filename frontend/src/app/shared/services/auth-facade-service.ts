import { computed, inject, Injectable, Signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

export interface User {
  readonly iss: string;
  readonly sub: string;
  readonly aud: string;
  readonly exp: number;
  readonly iat: number;
  readonly auth_time: number;
  readonly email: string;
  readonly email_verified: boolean;
  readonly name: string;
  readonly given_name: string;
  readonly preferred_username: string;
  readonly nickname: string;
  readonly groups: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  private readonly auth: OidcSecurityService = inject(OidcSecurityService);
  private readonly router: Router = inject(Router);

  public readonly isAuthenticated: Signal<boolean> = computed(
    () => this.auth.authenticated().isAuthenticated,
  );
  public readonly user: Signal<User | undefined> = computed(() => {
    if (!this.isAuthenticated()) {
      return undefined;
    }
    return this.auth.userData().userData as User;
  });

  public login(redirect?: string): void {
    sessionStorage.setItem('postLoginRedirect', redirect ?? '/');

    this.auth.authorizeWithPopUp().subscribe(({ isAuthenticated }) => {
      if (isAuthenticated) {
        const redirect: string = sessionStorage.getItem('postLoginRedirect') ?? '/';
        sessionStorage.removeItem('postLoginRedirect');
        this.router.navigate([redirect]).then((_) => {});
      }
    });
  }

  public logout(): void {
    this.auth.logoffAndRevokeTokens().subscribe();
  }
}
