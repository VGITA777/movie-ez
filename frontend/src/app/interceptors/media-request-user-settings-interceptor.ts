import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import {
  DEFAULT_USER_SETTINGS,
  USER_SETTINGS_STORAGE_KEY,
  UserSettings,
} from '@shared/shared-types';
import { storage } from '@signality/core';
import { environment } from '@environments/environment';

export const mediaRequestUserSettingsInterceptor: HttpInterceptorFn = (req, next) => {
  // Only include if it's contacting the /media endpoint
  if (!req.url.includes(environment.api.mediaBaseUrl)) {
    return next(req);
  }

  const settings: UserSettings = storage(USER_SETTINGS_STORAGE_KEY, DEFAULT_USER_SETTINGS)();
  const params: HttpParams = req.params;

  params.set('include_adult', String(settings.includeAdult));
  params.set('language', settings.preferredLanguage);

  return next(req);
};
