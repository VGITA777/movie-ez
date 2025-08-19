/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigatorService} from '@utils/navigator.service';
import {environment} from '@env/environment';

@Component({
  selector: 'app-settings',
  imports: [
    RouterOutlet
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  private readonly navigator: NavigatorService = inject(NavigatorService);

  ngOnInit(): void {
    if (!environment.isDebug) {
      this.navigator.navigateToError('Settings page is under construction.');
    }
  }

}
