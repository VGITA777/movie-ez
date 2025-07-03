import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationRailComponent} from './navigation-rail/navigation-rail.component';
import {Subscription, timer} from 'rxjs';
import {ProgressShowerService, ProgressType} from './shared/utils/progress-shower.service';
import {
  IndeterminateProgressBarComponent
} from './shared/ui/indeterminate-progress-bar/indeterminate-progress-bar.component';
import {DeviceSizeService} from './shared/utils/device-size.service';
import {NgClass} from '@angular/common';
import {LoadingComponent} from './loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent, IndeterminateProgressBarComponent, NgClass, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit, OnDestroy {

  toastSubscription!: Subscription;
  readonly progressShower: ProgressShowerService = inject(ProgressShowerService);
  readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
  readonly isTabletMedium: Signal<boolean> = this.deviceSizeService.isTabletMedium;
  readonly progress: Signal<number> = this.progressShower.progress;
  readonly progressType: Signal<ProgressType> = this.progressShower.progressType;

  // Loading screen properties
  readonly minimumLoadTimeMillis: number = 1500;
  readonly isDeletingLoadingScreen: WritableSignal<boolean> = signal(false);
  readonly showLoadingScreen: WritableSignal<boolean> = signal(true);
  readonly loadingScreen: Signal<ElementRef<HTMLDivElement>> = viewChild.required('loadingContainer');

  ngOnInit() {
    this.startProcessingLoadingScreen();
  }

  ngOnDestroy() {
    this.toastSubscription?.unsubscribe();
  }

  private startProcessingLoadingScreen() {
    timer(this.minimumLoadTimeMillis).subscribe(() => {
      const target: HTMLDivElement = this.loadingScreen().nativeElement;
      this.isDeletingLoadingScreen.set(true);
      target.addEventListener('transitionend', () => {
        this.hideLoadingScreen()
      }, {once: true})
    });
  }

  private hideLoadingScreen() {
    this.showLoadingScreen.set(false);
    this.isDeletingLoadingScreen.set(false);
  }
}
