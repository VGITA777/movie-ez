import { AfterViewInit, Component, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from '@spartan-ng/brain/sonner';
import { storage } from '@signality/core';

@Component({
  selector: 'me-root',
  imports: [RouterOutlet, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private readonly showSwipeToast: WritableSignal<boolean> = storage('showSwipeToast', true);

  ngAfterViewInit(): void {
    this.triggerSwipeToast();
  }

  private triggerSwipeToast(): void {
    if (!this.showSwipeToast()) {
      return;
    }
    toast.info('Did you know? The sliders can be swiped!', {
      position: 'top-right',
      duration: 8000,
      action: {
        label: 'Ok!',
        onClick: () => {
          this.showSwipeToast.set(false);
        },
      },
    });
  }
}
