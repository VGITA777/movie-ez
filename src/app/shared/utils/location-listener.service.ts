/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Page} from '@navigation/utils/page';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocationListenerService {

  readonly location: Location = inject(Location);
  private readonly _currentLocation: WritableSignal<Page> = signal(Page.HOME);
  readonly currentLocation: Signal<Page> = this._currentLocation.asReadonly();

  constructor() {
    this.location.onUrlChange(this.onUrlChangeHandler.bind(this))
  }

  private onUrlChangeHandler(url: string): void {
    if (url === '/') {
      this._currentLocation.set(Page.HOME);
    } else if (url === '/movies') {
      this._currentLocation.set(Page.MOVIES);
    } else if (url === '/tv-shows') {
      this._currentLocation.set(Page.TV_SHOWS);
    } else if (url === '/search') {
      this._currentLocation.set(Page.SEARCH);
    } else if (url.startsWith('/watch/movie')) {
      this._currentLocation.set(Page.WATCH_MOVIE);
    } else if (url.startsWith('/watch/tv')) {
      this._currentLocation.set(Page.WATCH_TV_SHOW);
    } else if (url.startsWith('/settings')) {
      this._currentLocation.set(Page.SETTINGS);
    } else {
      this._currentLocation.set(Page.HOME);
    }
  }
}
