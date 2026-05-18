import { computed, inject, Injectable, Signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

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

  public readonly isAuthenticated: Signal<boolean> = computed(
    () => this.auth.authenticated().isAuthenticated,
  );
  public readonly user: Signal<User | undefined> = computed(() => {
    if (!this.isAuthenticated()) {
      return undefined;
    }
    return this.auth.userData().userData as User;
  });

  public login(): void {
    this.auth.authorizeWithPopUp().subscribe();
  }

  public logout(): void {
    this.auth.logoffAndRevokeTokens().subscribe();
  }
}
