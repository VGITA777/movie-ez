import {Directive, ElementRef, inject, input, InputSignal, OnInit} from '@angular/core';
import {GlobalsService} from '@utils/globals.service';
import {DeviceSizeService} from '@utils/device-size.service';
import {environment} from '@env/environment';

@Directive({
  selector: '[appBottomNavBarSpacer]',
  standalone: true
})
export class BottomNavBarSpacerDirective implements OnInit {

  readonly withPadding = input<boolean>(false);
  readonly additionalPadding = input<number>(0);

  private readonly el: ElementRef = inject(ElementRef);
  private readonly globalsService: GlobalsService = inject(GlobalsService);
  private readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);

  ngOnInit(): void {
    if (!this.deviceSizeService.isMobile() && !this.deviceSizeService.isTabletMedium()) {
      console.log('NOT ADDING BOTTOM NAV BAR SPACER')
      return;
    }
    if (environment.isLoggingEnabled) {
      console.log('Adding BottomNavBarSpacer');
    }
    const spacer: HTMLDivElement = document.createElement('div');
    spacer.style.width = '100%';
    spacer.style.height = `${((this.withPadding()) ? this.globalsService.bottomNavBarHeightWithPadding() : this.globalsService.bottomNavBarHeight()) + this.additionalPadding()}px`;
    this.el.nativeElement.appendChild(spacer);
  }
}
