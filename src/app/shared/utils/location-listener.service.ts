/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {inject, Injectable, Signal} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, startWith} from 'rxjs';
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
      map(() => this.resolveCurrentPage()),
      startWith(this.resolveCurrentPage())
    ),
    {initialValue: Page.HOME}
  );

  private resolveCurrentPage(): Page {
    // Prefer explicit route data if configured on routes: data: { page: Page.MOVIES }
    const deepest = this.getDeepestSnapshot(this.router.routerState.snapshot.root);
    const pageFromData = deepest?.data?.['page'] as Page | undefined;
    if (pageFromData !== undefined) {
      return pageFromData;
    }
    // Fallback: infer from URL
    return this.mapUrlToPage(this.router.url ?? '/');
  }

  private getDeepestSnapshot(route: ActivatedRouteSnapshot | null): ActivatedRouteSnapshot | null {
    let node = route;
    while (node?.firstChild) {
      node = node.firstChild;
    }
    return node ?? null;
  }

  private mapUrlToPage(url: string): Page {
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
      if (re.test(url)) return page;
    }
    return Page.HOME;
  }
}
