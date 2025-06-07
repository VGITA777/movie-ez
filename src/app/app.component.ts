import {Component, inject, OnDestroy, OnInit, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationRailComponent} from './navigation-rail/navigation-rail.component';
import {Subscription} from 'rxjs';
import {ProgressShowerService, ProgressType} from './shared/utils/progress-shower.service';
import {
  IndeterminateProgressBarComponent
} from './shared/ui/indeterminate-progress-bar/indeterminate-progress-bar.component';
import {DeviceSizeService} from './shared/utils/device-size.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent, IndeterminateProgressBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit, OnDestroy {

  toastSubscription!: Subscription;
  /*  readonly messageService: MessageService = inject(MessageService);
    readonly toast: ToastService = inject(ToastService);*/
  readonly progressShower: ProgressShowerService = inject(ProgressShowerService);
  readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
  readonly isMobile: Signal<boolean> = this.deviceSizeService.isMobile;
  readonly progress: Signal<number> = this.progressShower.progress;
  readonly progressType: Signal<ProgressType> = this.progressShower.progressType;

  ngOnInit() {
    /*    this.toastSubscription = this.toast.message.subscribe((e) => {
          if (!e) {
            return;
          }
          this.messageService.add(e);
        })*/
  }

  ngOnDestroy() {
    this.toastSubscription.unsubscribe();
  }
}
