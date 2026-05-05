import {
  Component,
  HostListener,
  input,
  InputSignal,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideUser } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { NgClass } from '@angular/common';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { SearchMe } from '@search/search.me';

@Component({
  selector: 'me-navigation',
  imports: [
    HlmInputGroupImports,
    HlmIconImports,
    HlmAvatarImports,
    NgClass,
    HlmDialogImports,
    SearchMe,
  ],
  templateUrl: './navigation.me.html',
  styleUrl: './navigation.me.css',
  providers: [provideIcons({ lucideSearch, lucideUser })],
})
export class NavigationMe {
  private readonly _showBg: WritableSignal<boolean> = signal(false);

  protected readonly showBg: Signal<boolean> = this._showBg.asReadonly();

  public readonly threshold: InputSignal<number> = input(250);

  @HostListener('window:scroll')
  protected onScroll(): void {
    this._showBg.set(window.scrollY >= this.threshold());
  }
}
