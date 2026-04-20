/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {inject, Injectable, Signal} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceSizeService {
  readonly breakpointsObserver: BreakpointObserver = inject(BreakpointObserver);

  readonly isMobile: Signal<boolean> = this.createSignalForSize('mobile');
  readonly isMobileSmall: Signal<boolean> = this.createSignalForSize('mobile-small');
  readonly isMobileMedium: Signal<boolean> = this.createSignalForSize('mobile-medium');
  readonly isMobileLarge: Signal<boolean> = this.createSignalForSize('mobile-large');

  readonly isTablet: Signal<boolean> = this.createSignalForSize('tablet');
  readonly isTabletMedium: Signal<boolean> = this.createSignalForSize('tablet-medium');
  readonly isTabletMediumBelow: Signal<boolean> = this.createSignalForSize('tablet-medium-below');
  readonly isTabletLarge: Signal<boolean> = this.createSignalForSize('tablet-large');

  readonly isLaptop: Signal<boolean> = this.createSignalForSize('laptop');

  readonly isDesktop: Signal<boolean> = this.createSignalForSize('desktop');

  private createSignalForSize(size: DeviceSize): Signal<boolean> {
    return toSignal(this.breakpointsObserver.observe(DeviceSizeMap[size]).pipe(map(r => r.matches)), {initialValue: false});
  }
}

export type DeviceSize =
  'mobile-small' |
  'mobile-medium' |
  'mobile-large' |
  'mobile' |
  'tablet-medium' |
  'tablet-large' |
  'tablet-medium-below' |
  'tablet' |
  'laptop' |
  'desktop';

export const DeviceSizeMap: Record<DeviceSize, string> = {
  'mobile-small': '(max-width: 320px)',
  'mobile-medium': '(max-width: 375px)',
  'mobile-large': '(max-width: 425px)',
  'mobile': '(max-width: 435px)',
  'tablet-medium': '(min-width: 426px) and (max-width: 597px)',
  'tablet-large': '(min-width: 598px) and (max-width: 768px)',
  'tablet-medium-below': '(max-width: 597px)',
  'tablet': '(max-width: 768px)',
  'laptop': '(min-width: 769px) and (max-width: 1024px)',
  'desktop': '(min-width: 1025px)',
};
