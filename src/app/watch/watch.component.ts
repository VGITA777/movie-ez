import {Component, inject, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeviceSizeService} from '../shared/utils/device-size.service';

@Component({
  selector: 'app-watch',
  imports: [
    RouterOutlet
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent {
  protected readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
  protected readonly isDesktop: Signal<boolean> = this.deviceSizeService.isDesktop;
}
