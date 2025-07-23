import {Component, inject, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeviceSizeService} from '../shared/utils/device-size.service';
import {BottomNavBarSpacerDirective} from '@shared/directives/bottom-nav-bar-spacer.directive';

@Component({
  selector: 'app-watch',
  imports: [
    RouterOutlet,
    BottomNavBarSpacerDirective
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent {
  protected readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
  protected readonly isDesktop: Signal<boolean> = this.deviceSizeService.isDesktop;
}
