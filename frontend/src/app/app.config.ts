import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mediaRequestUserSettingsInterceptor } from '@app/interceptors/media-request-user-settings-interceptor';
import {
  authInterceptor,
  LogLevel,
  provideAuth,
  withAppInitializerAuthCheck,
} from 'angular-auth-oidc-client';
import { environment } from '@environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mediaRequestUserSettingsInterceptor, authInterceptor()])),
    provideAuth(
      {
        config: {
          authority: environment.auth.authority,
          clientId: environment.auth.clientId,
          useRefreshToken: true,
          silentRenew: true,
          responseType: 'code',
          scope: 'openid profile email offline_access',
          ignoreNonceAfterRefresh: true,
          triggerRefreshWhenIdTokenExpired: false,
          renewTimeBeforeTokenExpiresInSeconds: 30,
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          logLevel: environment.auth.isDebug ? LogLevel.Debug : LogLevel.Error,
          secureRoutes: [
            'http://localhost:4000/users/*',
            'http://192.168.1.108:4000/users/*',
            'http://192.168.0.117:4000/users/*',
          ],
        },
      },
      withAppInitializerAuthCheck(),
    ),
  ],
};
