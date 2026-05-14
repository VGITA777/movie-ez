import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LongHover } from '@shared/directives/long-hover';
import { NgOptimizedImage } from '@angular/common';

export interface InteractiveMediaCardItem {
  title: string;
  imgSrc: string;
  videoSrc?: string;
}

@Component({
  selector: 'me-interactive-media-card',
  imports: [LongHover, NgOptimizedImage],
  templateUrl: './interactive-media-card.me.html',
  styleUrl: './interactive-media-card.me.css',
})
export class InteractiveMediaCardMe {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  public readonly item: InputSignal<InteractiveMediaCardItem> = input.required();
  public readonly playOnHover: InputSignal<boolean> = input(true);
  public readonly playOnHoverDelay: InputSignal<number> = input(500);

  protected readonly startVideo: WritableSignal<boolean> = signal(false);
  protected readonly sanitizedVideoSrc: Signal<SafeResourceUrl | null> = computed(() => {
    const videoSrc = this.item().videoSrc;
    if (!videoSrc) {
      return null;
    }
    return this.domSanitizer.bypassSecurityTrustResourceUrl(videoSrc);
  });

  public play(): void {
    this.startVideo.set(true);
  }

  public stop(): void {
    this.startVideo.set(false);
  }

  protected handleLongHover(event: boolean): void {
    const shouldStartVideo = event && this.playOnHover();
    if (this.startVideo() === shouldStartVideo) {
      return;
    }
    this.startVideo.set(shouldStartVideo);
  }
}
