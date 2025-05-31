import {Component, inject, Signal} from '@angular/core';
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
  readonly locationListener: LocationListenerService = inject(LocationListenerService);
  readonly navigator: NavigatorService = inject(NavigatorService);
  readonly currentLocation: Signal<Page> = this.locationListener.currentLocation;
  protected readonly Page = Page;

}
