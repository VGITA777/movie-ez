import { Component } from '@angular/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideHouse } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'me-not-found',
  imports: [HlmEmptyImports, HlmIconImports, HlmButtonImports, RouterLink],
  templateUrl: './not-found.me.html',
  styleUrl: './not-found.me.css',
  providers: [provideIcons({ lucideCircleAlert, lucideHouse })],
})
export class NotFoundMe {}
