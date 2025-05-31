import {Component, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationRailComponent} from './navigation-rail/navigation-rail.component';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ToastService} from './shared/utils/toast.service';
import {Subscription} from 'rxjs';
import {ProgressBar} from 'primeng/progressbar';
import {ProgressShowerService, ProgressType} from './shared/utils/progress-shower.service';
import {ScrollTopComponent} from './shared/ui/scroll-top/scroll-top.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent, Toast, ProgressBar, ScrollTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {

  toastSubscription!: Subscription;
  readonly progress: Signal<number>;
  readonly progressType: Signal<ProgressType>;
  protected readonly parent = parent;

  constructor(readonly messageService: MessageService, readonly toast: ToastService, readonly progressShower: ProgressShowerService) {
    this.progress = this.progressShower.progress;
    this.progressType = this.progressShower.progressType;
  }

  ngOnInit() {
    this.toastSubscription = this.toast.message.subscribe((e) => {
      if (!e) {
        return;
      }
      this.messageService.add(e);
    })
  }

  ngOnDestroy() {
    this.toastSubscription.unsubscribe();
  }
}

