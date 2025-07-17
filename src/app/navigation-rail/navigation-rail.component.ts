/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, inject, Signal} from '@angular/core';
import {Page} from '@navigation/utils/page';
import {LocationListenerService} from '@utils/location-listener.service';
import {NavigatorService} from '@utils/navigator.service';
import {NavigationRailEntryComponent} from '@navigation/ui/navigation-rail-entry/navigation-rail-entry.component';

@Component({
  selector: 'app-navigation-rail',
  imports: [
    NavigationRailEntryComponent
  ],
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss'
})
export class NavigationRailComponent {
  readonly locationListener: LocationListenerService = inject(LocationListenerService);
  readonly navigator: NavigatorService = inject(NavigatorService);
  readonly currentLocation: Signal<Page> = this.locationListener.currentLocation;
  protected readonly Page = Page;

}
