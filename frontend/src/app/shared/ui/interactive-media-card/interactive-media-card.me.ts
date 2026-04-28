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
  videoSrc: string;
}

@Component({
  selector: 'me-interactive-media-card',
  imports: [LongHover, NgOptimizedImage],
  templateUrl: './interactive-media-card.me.html',
  styleUrl: './interactive-media-card.me.css',
})
export class InteractiveMediaCardMe {
  public readonly item: InputSignal<InteractiveMediaCardItem> = input.required();
  public readonly playOnHover: InputSignal<boolean> = input(true);
  public readonly playOnHoverDelay: InputSignal<number> = input(500);

  protected readonly startVideo: WritableSignal<boolean> = signal(false);
  protected readonly sanitizedVideoSrc: Signal<SafeResourceUrl | null> = computed(() => {
    const videoSrc = this.item().videoSrc;
    return videoSrc ? this.domSanitizer.bypassSecurityTrustResourceUrl(videoSrc) : null;
  });

  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  public play(): void {
    this.startVideo.set(true);
  }

  public stop(): void {
    this.startVideo.set(false);
  }

  protected sanitizeVideoSrc(videoSrc: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(videoSrc);
  }

  protected handleLongHover(event: boolean): void {
    this.startVideo.set(event && this.playOnHover());
  }
}
