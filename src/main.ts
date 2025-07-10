import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {register} from 'swiper/element';

// Register Swiper js
register();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// This file is the entry point for the Angular application.
