/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, inject} from '@angular/core';
import {BottomNavItemComponent} from '@ui/bottom-nav-bar/ui/bottom-nav-item/bottom-nav-item.component';
import {LocationListenerService} from '@utils/location-listener.service';
import {NavigatorService} from '@utils/navigator.service';
import {Page} from '@constants';

@Component({
  selector: 'app-bottom-nav-bar',
  imports: [
    BottomNavItemComponent
  ],
  templateUrl: './bottom-nav-bar.component.html',
  styleUrl: './bottom-nav-bar.component.scss'
})
export class BottomNavBarComponent {
  readonly locationListener: LocationListenerService = inject(LocationListenerService);
  readonly navigator: NavigatorService = inject(NavigatorService);
  protected readonly Page = Page;
}
