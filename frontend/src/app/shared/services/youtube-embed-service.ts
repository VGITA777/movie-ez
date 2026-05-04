import { inject, Injectable } from '@angular/core';
import { UserSettingService } from '@shared/services/user-setting.service';

@Injectable({
  providedIn: 'root',
})
export class YoutubeEmbedService {
  private readonly userSettings: UserSettingService = inject(UserSettingService);

  public getYoutubeEmbedUrl(key: string): string {
    const { mutedTrailers, loopTrailers } = this.userSettings.getUserSettings();

    const params = new URLSearchParams({
      autoplay: '1',
      mute: mutedTrailers ? '1' : '0',
      controls: '0',
      loop: loopTrailers ? '1' : '0',
      disablekb: '1',
    });

    if (loopTrailers) {
      params.set('playlist', key);
    }

    return `https://www.youtube.com/embed/${key}?${params.toString()}`;
  }
}
