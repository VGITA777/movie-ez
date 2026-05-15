import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpToLine } from '@ng-icons/lucide';

@Component({
  selector: 'me-back-to-top',
  imports: [HlmButtonImports, HlmIconImports],
  templateUrl: './back-to-top.me.html',
  styleUrl: './back-to-top.me.css',
  providers: [provideIcons({ lucideArrowUpToLine })],
})
export class BackToTopMe {
  protected isVisible: WritableSignal<boolean> = signal(false);

  private readonly scrollOffset: number = 300;

  protected goToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isVisible.set(scrollPosition > this.scrollOffset);
  }
}
