import {Component, Signal} from '@angular/core';
import {Page} from './utils/page';
import {LocationListenerService} from '../shared/utils/location-listener.service';
import {NavigatorService} from '../shared/utils/navigator.service';
import {NavigationRailEntryComponent} from './ui/navigation-rail-entry/navigation-rail-entry.component';

@Component({
  selector: 'app-navigation-rail',
  imports: [
    NavigationRailEntryComponent
  ],
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss'
})
export class NavigationRailComponent {
  readonly currentLocation: Signal<Page>
  protected readonly Page = Page;

  constructor(readonly locationListener: LocationListenerService, readonly navigator: NavigatorService) {
    this.currentLocation = locationListener.currentLocation;
  }

}
