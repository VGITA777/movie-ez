import { AfterViewInit, Component, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { ExternalToast, toast } from '@spartan-ng/brain/sonner';
import { routerListener, storage } from '@signality/core';
import { NavigationMe } from '@app/navigation/navigation.me';

export type ToastType = 'error' | 'message' | 'info';

export interface GenericRouteData {
  message: string;
  type: ToastType;
}

@Component({
  selector: 'me-root',
  imports: [RouterOutlet, HlmToasterImports, NavigationMe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private readonly showSwipeToast: WritableSignal<boolean> = storage('showSwipeToast', true);

  constructor() {
    routerListener('navigationend', () => {
      this.handleMessages(() => {
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

  private handleMessages(callback: () => void): void {
    const { messages = [] as GenericRouteData[] } = history.state || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return;
    }

    messages.forEach((messageData: GenericRouteData) => {
      const { message, type } = messageData;
      this.triggerToast(message, type);
    });
    callback();
  }

  private triggerToast(
    message: string,
    type: ToastType,
    data: ExternalToast = { position: 'top-right' },
  ): void {
    switch (type) {
      case 'error':
        toast.error(message, data);
        break;
      case 'message':
        toast.message(message, data);
        break;
      default:
        toast.info(message, data);
        break;
    }
  }

  private clearHistoryState(): void {
    const current = history.state || {};
    history.replaceState(
      {
        ...current,
        messages: [],
      },
      '',
    );
  }
}
