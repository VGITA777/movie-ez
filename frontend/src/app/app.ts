import { AfterViewInit, Component, inject, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { toast } from '@spartan-ng/brain/sonner';
import { routerListener, storage } from '@signality/core';

export interface GenericRouteData {
  isError: boolean;
  message: string;
}

@Component({
  selector: 'me-root',
  imports: [RouterOutlet, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private readonly router: Router = inject(Router);
  private readonly showSwipeToast: WritableSignal<boolean> = storage('showSwipeToast', true);

  constructor() {
    routerListener('navigationend', () => {
      this.handleRedirectMessages(() => {
        this.clearHistoryState();
      });
    });
  }

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

  private handleRedirectMessages(callback: () => void): void {
    this.handleRedirectErrorMessages();
    this.handleRedirectGenericMessages();
    callback();
  }

  private handleRedirectGenericMessages(): void {
    const state = history.state['messages'] as GenericRouteData[];
    if (!this.checkArrayIsNotEmpty(state)) {
      return;
    }

    const data: GenericRouteData[] = state.filter((data) => !data.isError && data.message);
    data.forEach((messageData) => {
      toast(messageData.message, {
        position: 'top-right',
      });
    });
  }

  private handleRedirectErrorMessages(): void {
    const state = history.state['errors'] as GenericRouteData[];
    if (!this.checkArrayIsNotEmpty(state)) {
      return;
    }

    const data: GenericRouteData[] = state.filter((data) => data.isError && data.message);
    data.forEach((errorData) => {
      console.log('Redirected with error message: ', errorData.message);
      this.triggerErrorToast(errorData.message);
    });
  }

  private triggerErrorToast(message: string): void {
    toast.error(message, {
      position: 'top-right',
    });
  }

  private clearHistoryState(): void {
    history.replaceState({ isError: false, message: '' } as GenericRouteData, '');
  }

  private checkArrayIsNotEmpty(arr: any): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }
}
