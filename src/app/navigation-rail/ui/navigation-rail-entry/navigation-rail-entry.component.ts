/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navigation-rail-entry',
  imports: [
    NgClass
  ],
  templateUrl: './navigation-rail-entry.component.html',
  styleUrl: './navigation-rail-entry.component.scss'
})
export class NavigationRailEntryComponent {
  readonly onClick: OutputEmitterRef<void> = output();
  readonly isActive: InputSignal<boolean> = input(false);

  protected onClickHandler(): void {
    this.onClick.emit();
  }
}
