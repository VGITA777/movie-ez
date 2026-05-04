import { Injectable, Signal, WritableSignal } from '@angular/core';
import { isValidLanguageCode, LanguageCode } from '@shared/models';
import { storage } from '@signality/core';

export interface UserSettings {
  includeAdult: boolean;
  preferredLanguage: LanguageCode;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  includeAdult: false,
  preferredLanguage: 'en',
};

export const USER_SETTINGS_STORAGE_KEY = 'user-settings';

@Injectable({
  providedIn: 'root',
})
export class UserSettingService {
  private _userSettings: WritableSignal<UserSettings> = storage(
    USER_SETTINGS_STORAGE_KEY,
    DEFAULT_USER_SETTINGS,
  );
  public userSettings: Signal<UserSettings> = this._userSettings.asReadonly();

  public getUserSettings(): UserSettings {
    const settings: UserSettings = this.userSettings();
    if (UserSettingService.isUserSettingsValid(settings)) {
      return settings;
    }
    return this.createVerifiedUserSettings();
  }

  public updateUserSettings(newSettings: Partial<UserSettings>): void {
    const currentSettings: UserSettings = this.userSettings();
    const updatedSettings: UserSettings = { ...currentSettings, ...newSettings };

    if (!UserSettingService.isUserSettingsValid(updatedSettings)) {
      console.warn('Attempted to update user settings with invalid values. Update aborted.');
      return;
    }

    this._userSettings.set(updatedSettings);
  }

  private createVerifiedUserSettings(): UserSettings {
    const settings: UserSettings = this.userSettings();
    const verifiedSettings: UserSettings = { ...settings };

    if (!isValidLanguageCode(settings.preferredLanguage)) {
      console.warn(
        `Invalid preferred language code "${settings.preferredLanguage}" in user settings. Defaulting to "en".`,
      );
      verifiedSettings.preferredLanguage = 'en';
    }

    if (typeof settings.includeAdult !== 'boolean') {
      console.warn(
        `Invalid includeAdult value "${settings.includeAdult}" in user settings. Defaulting to false.`,
      );
      verifiedSettings.includeAdult = false;
    }

    this.updateUserSettings(verifiedSettings);
    return verifiedSettings;
  }

  private static isUserSettingsValid(settings: UserSettings): boolean {
    if (!isValidLanguageCode(settings.preferredLanguage)) {
      return false;
    }

    if (typeof settings.includeAdult !== 'boolean') {
      return false;
    }

    return true;
  }
}
