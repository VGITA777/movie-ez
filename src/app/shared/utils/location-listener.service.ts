/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {inject, Injectable, Signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs';
import {Page} from '@constants';

@Injectable({
  providedIn: 'root'
})
export class LocationListenerService {
  private readonly router = inject(Router);

  // Single source-of-truth signal derived from the Router
  readonly currentLocation: Signal<Page> = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.mapUrlToPage(e.url)),
    ),
    {initialValue: Page.HOME}
  );

  private mapUrlToPage(url: string): Page {
    const urlWithoutQuery = url.split('?')[0];
    const patterns: Array<[RegExp, Page]> = [
      [/^\/$/, Page.HOME],
      [/^\/movies(?:\/|$)/, Page.MOVIES],
      [/^\/tv-shows(?:\/|$)/, Page.TV_SHOWS],
      [/^\/search(?:\/|$)/, Page.SEARCH],
      [/^\/watch\/movie(?:\/|$)/, Page.WATCH_MOVIE],
      [/^\/watch\/tv(?:\/|$)/, Page.WATCH_TV_SHOW],
      [/^\/settings(?:\/|$)/, Page.SETTINGS],
      [/^\/error(?:\/|$)/, Page.ERROR]
    ];

    for (const [re, page] of patterns) {
      if (re.test(urlWithoutQuery)) return page;
    }
    return Page.HOME;
  }
}
