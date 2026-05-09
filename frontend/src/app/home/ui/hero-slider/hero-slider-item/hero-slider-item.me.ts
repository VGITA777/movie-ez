import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon } from '@ng-icons/core';
import { HomeHeroSliderItem } from '@home/ui/hero-slider/hero-slider.me';
import { NotVisibleFor } from '@shared/directives/not-visible-for';
import { VisibleFor } from '@shared/directives/visible-for';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ShowPlaylistsDirective } from '@shared/directives/show-playlists-directive';

@Component({
  selector: 'me-hero-slider-item',
  imports: [HlmButton, NgIcon, NotVisibleFor, VisibleFor, ShowPlaylistsDirective],
  templateUrl: './hero-slider-item.me.html',
  styleUrl: './hero-slider-item.me.css',
})
export class HeroSliderItemMe {
  public readonly item: InputSignal<HomeHeroSliderItem> = input.required();
  public readonly handlePlay: OutputEmitterRef<HomeHeroSliderItem> = output();
  public readonly handleAddToPlaylist: OutputEmitterRef<HomeHeroSliderItem> = output();
  public readonly playVideo: InputSignal<boolean> = input(true);

  protected readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  protected readonly startVideo: WritableSignal<boolean> = signal(false);
  protected readonly sanitizedVideoSrc: Signal<SafeResourceUrl | undefined> = computed(() => {
    let url: string | undefined = this.item().videoSrc;
    if (url === undefined) {
      return;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.item().videoSrc!);
  });

  constructor() {
    effect(() => {
      console.log(`Genre for ${this.item().title}: ${this.item().genres.join(', ')}`);
    });
  }
}
