import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  InputSignal,
  signal,
  Signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideUser } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { NgClass } from '@angular/common';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';
import { WatchMe } from '@watch/watch.me';
import { HomeMe } from '@home/home.me';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'me-navigation',
  imports: [
    HlmInputGroupImports,
    HlmIconImports,
    HlmAvatarImports,
    NgClass,
    HlmDialogImports,
    HlmButtonImports,
  ],
  templateUrl: './navigation.me.html',
  styleUrl: './navigation.me.css',
  providers: [provideIcons({ lucideSearch, lucideUser })],
})
export class NavigationMe {
  private readonly dialogService: HlmDialogService = inject(HlmDialogService);
  private readonly _showBg: WritableSignal<boolean> = signal(false);
  private readonly test: Signal<TemplateRef<unknown>> = viewChild.required('test');

  protected readonly showBg: Signal<boolean> = this._showBg.asReadonly();

  public readonly threshold: InputSignal<number> = input(250);

  @HostListener('window:scroll')
  protected onScroll(): void {
    this._showBg.set(window.scrollY >= this.threshold());
  }

  protected openSearchDialog() {
    this.dialogService.open(HomeMe);
  }
}
