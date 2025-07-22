import {
  Component,
  computed,
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
import {NavigationRailComponent} from '@navigation/navigation-rail.component';
import {Subscription, timer} from 'rxjs';
import {ProgressShowerService, ProgressType} from '@utils/progress-shower.service';
import {IndeterminateProgressBarComponent} from '@ui/indeterminate-progress-bar/indeterminate-progress-bar.component';
import {DeviceSizeService} from '@utils/device-size.service';
import {NgClass} from '@angular/common';
import {LoadingComponent} from './loading/loading.component';
import {environment} from '@env/environment';
import {BottomNavBarComponent} from '@ui/bottom-nav-bar/bottom-nav-bar.component';
import {BottomNavItemComponent} from '@ui/bottom-nav-bar/ui/bottom-nav-item/bottom-nav-item.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent, IndeterminateProgressBarComponent, NgClass, LoadingComponent, BottomNavBarComponent, BottomNavItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit, OnDestroy {

  toastSubscription!: Subscription;
  readonly progressShower: ProgressShowerService = inject(ProgressShowerService);
  readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
  readonly isTabletMedium: Signal<boolean> = this.deviceSizeService.isTabletMedium;
  readonly isMobile: Signal<boolean> = this.deviceSizeService.isMobile;
  readonly progress: Signal<number> = this.progressShower.progress;
  readonly progressType: Signal<ProgressType> = this.progressShower.progressType;

  // Loading screen properties
  readonly minimumLoadTimeMillis: number = (environment.isDebug) ? 0 : 1500;
  readonly isDeletingLoadingScreen: WritableSignal<boolean> = signal(false);
  readonly showLoadingScreen: WritableSignal<boolean> = signal(true);
  readonly loadingScreen: Signal<ElementRef<HTMLDivElement>> = viewChild.required('loadingContainer');

  // TODO: Find a way to add padding to the bottom nav bar
  readonly bottomNavBar: Signal<ElementRef<HTMLElement> | undefined> = viewChild('bottomNavBar');
  readonly bottomNavBarHeight: Signal<number> = computed(() => this.bottomNavBar()?.nativeElement?.offsetHeight ?? 0)

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
