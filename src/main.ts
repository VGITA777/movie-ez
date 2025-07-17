/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from '@app/app.config';
import {AppComponent} from '@app/app.component';
import {register} from 'swiper/element';

// Register Swiper js
register();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
