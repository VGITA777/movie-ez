/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    /*    providePrimeNG({
          theme: {
            preset: MyTheme,
            options: {
              darkModeSelector: '.dark-mode',
            }
          },
        })*/
  ]
};
