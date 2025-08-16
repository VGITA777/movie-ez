import {Component, inject} from '@angular/core';
import {SkeletonComponent} from '@ui/skeleton/skeleton.component';
import {DeviceSizeService} from '@utils/device-size.service';

@Component({
  selector: 'app-mini-media-description-skeleton',
  imports: [
    SkeletonComponent
  ],
  templateUrl: './mini-media-description-skeleton.component.html',
  styleUrl: './mini-media-description-skeleton.component.scss'
})
export class MiniMediaDescriptionSkeletonComponent {
  protected readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
}
