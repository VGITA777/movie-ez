import { Directive, HostListener, inject, input, InputSignal } from '@angular/core';
import { HlmDialogOptions, HlmDialogService } from '@spartan-ng/helm/dialog';
import { PlaylistDialogMe } from '@app/playlist-dialog/playlist-dialog.me';
import { MediaType } from '@shared/models';

export interface ShowPlaylistsDirectiveContext {
  trackId: string | number;
  mediaType: MediaType;
}

@Directive({
  selector: '[meShowPlaylists]',
})
export class ShowPlaylistsDirective {
  private readonly hlmDialogService: HlmDialogService = inject(HlmDialogService);

  public readonly options: InputSignal<Partial<HlmDialogOptions>> = input({});
  public readonly playlistContext: InputSignal<ShowPlaylistsDirectiveContext> = input.required();

  @HostListener('click')
  onClick(): void {
    const inputClasses = this.options().contentClass;
    const classes: string =
      inputClasses !== undefined && inputClasses.trim() !== ''
        ? inputClasses
        : 'w-[90vw]! max-w-[500px] max-h-[unset]!';
    const context: ShowPlaylistsDirectiveContext = this.playlistContext();
    this.hlmDialogService.open(PlaylistDialogMe, {
      ...this.options(),
      contentClass: classes,
      context: context,
    });
  }
}
