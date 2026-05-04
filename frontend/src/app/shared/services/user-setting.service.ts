import { Injectable, WritableSignal } from '@angular/core';
import { storage } from '@signality/core';
import { isValidLanguageCode, LanguageCode } from '@shared/models';

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
  private readonly userSettings: WritableSignal<UserSettings> = storage(
    USER_SETTINGS_STORAGE_KEY,
    DEFAULT_USER_SETTINGS,
  );

  public getUserSettings(): UserSettings {
    const settings: UserSettings = this.userSettings();
    if (this.isUserSettingsValid(settings)) {
      return settings;
    }

    console.warn('User settings are invalid. Resetting to default settings.');

    const verifiedSettings: UserSettings = this.createVerifiedUserSettings();
    this.updateUserSettings(verifiedSettings);
    return verifiedSettings;
  }

  public updateUserSettings(newSettings: Partial<UserSettings>): void {
    const currentSettings: UserSettings = this.userSettings();
    const updatedSettings: UserSettings = { ...currentSettings, ...newSettings };

    if (!this.isUserSettingsValid(updatedSettings)) {
      console.warn('Attempted to update user settings with invalid values. Update aborted.');
      return;
    }

    this.userSettings.set(updatedSettings);
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

    return verifiedSettings;
  }

  private isUserSettingsValid(settings: UserSettings): boolean {
    if (!isValidLanguageCode(settings.preferredLanguage)) {
      return false;
    }

    if (typeof settings.includeAdult !== 'boolean') {
      return false;
    }

    return true;
  }
}
