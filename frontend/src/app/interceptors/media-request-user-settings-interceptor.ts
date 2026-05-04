import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';
import { UserSettings, UserSettingService } from '@shared/services/user-setting.service';
import { inject } from '@angular/core';

export const mediaRequestUserSettingsInterceptor: HttpInterceptorFn = (req, next) => {
  // Only include if it's contacting the /media endpoint
  if (!req.url.includes(environment.api.mediaBaseUrl)) {
    return next(req);
  }

  const userSettingsService: UserSettingService = inject(UserSettingService);
  const settings: UserSettings = userSettingsService.getUserSettings();

  const params = req.params
    .set('includeAdult', String(settings.includeAdult))
    .set('language', settings.preferredLanguage);

  const newRequests = req.clone({ params });
  return next(newRequests);
};
