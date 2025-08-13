/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  private readonly router: Router = inject(Router);
  protected readonly errorMessage: string = this.router.getCurrentNavigation()?.extras?.state?.['message'] ?? 'Page not found';
  protected readonly errorCode: number = this.router.getCurrentNavigation()?.extras?.state?.['errorCode'] ?? 404;
}
