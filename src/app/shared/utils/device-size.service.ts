import {inject, Injectable, Signal} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceSizeService {
  readonly breakpointsObserver: BreakpointObserver = inject(BreakpointObserver);
  readonly isMobileSmall: Signal<boolean> = this.createSignalForSize('mobile-small');
  readonly isMobileMedium: Signal<boolean> = this.createSignalForSize('mobile-medium');
  readonly isMobileLarge: Signal<boolean> = this.createSignalForSize('mobile-large');
  readonly isTabletMedium: Signal<boolean> = this.createSignalForSize('tablet-medium');
  readonly isTabletLarge: Signal<boolean> = this.createSignalForSize('tablet-large');
  readonly isLaptop: Signal<boolean> = this.createSignalForSize('laptop');
  readonly isDesktop: Signal<boolean> = this.createSignalForSize('desktop');
  readonly isMobile: Signal<boolean> = toSignal(this.breakpointsObserver.observe(
      [
        DeviceSizeMap['mobile-small'],
        DeviceSizeMap['mobile-medium'],
        DeviceSizeMap['mobile-large']
      ]
    ).pipe(map(r => r.matches)), {initialValue: false}
  );
  readonly isTablet: Signal<boolean> = toSignal(this.breakpointsObserver.observe(
    [
      DeviceSizeMap['tablet-medium'],
      DeviceSizeMap['tablet-large']
    ]
  ).pipe(map(r => r.matches)), {initialValue: false});
  readonly currentDeviceSize: Signal<DeviceSize> = toSignal(this.breakpointsObserver.observe(
      [
        DeviceSizeMap['mobile-small'],
        DeviceSizeMap['mobile-medium'],
        DeviceSizeMap['mobile-large'],
        DeviceSizeMap['tablet-medium'],
        DeviceSizeMap['tablet-large'],
        DeviceSizeMap['laptop'],
        DeviceSizeMap['desktop']
      ]
    ).pipe(map(r => {
        if (r.breakpoints[DeviceSizeMap['mobile-small']]) {
          return 'mobile-small';
        } else if (r.breakpoints[DeviceSizeMap['mobile-medium']]) {
          return 'mobile-medium';
        } else if (r.breakpoints[DeviceSizeMap['mobile-large']]) {
          return 'mobile-large';
        } else if (r.breakpoints[DeviceSizeMap['tablet-medium']]) {
          return 'tablet-medium';
        } else if (r.breakpoints[DeviceSizeMap['tablet-large']]) {
          return 'tablet-large';
        } else if (r.breakpoints[DeviceSizeMap['laptop']]) {
          return 'laptop';
        } else {
          return 'desktop';
        }
      })
    ),
    {initialValue: 'desktop'}
  );

  private createSignalForSize(size: DeviceSize): Signal<boolean> {
    return toSignal(this.breakpointsObserver.observe(DeviceSizeMap[size]).pipe(map(r => r.matches)), {initialValue: false});
  }
}

export type DeviceSize =
  'mobile-small' |
  'mobile-medium' |
  'mobile-large' |
  'tablet-medium' |
  'tablet-large' |
  'laptop' |
  'desktop';

export type MobileSize = 'mobile-small' | 'mobile-medium' | 'mobile-large';
export type TabletSize = 'tablet-medium' | 'tablet-large';
export type LaptopSize = 'laptop';
export type DesktopSize = 'desktop';

export const DeviceSizeMap: Record<DeviceSize, string> = {
  'mobile-small': '(max-width: 320px)',
  'mobile-medium': '(max-width: 375px)',
  'mobile-large': '(max-width: 425px)',
  'tablet-medium': '(min-width: 426px) and (max-width: 597px)',
  'tablet-large': '(min-width: 598px) and (max-width: 768px)',
  'laptop': '(min-width: 769px) and (max-width: 1024px)',
  'desktop': '(min-width: 1025px)',
};
