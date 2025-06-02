import {Component, inject, OnDestroy, OnInit, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationRailComponent} from './navigation-rail/navigation-rail.component';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ToastService} from './shared/utils/toast.service';
import {Subscription} from 'rxjs';
import {ProgressBar} from 'primeng/progressbar';
import {ProgressShowerService, ProgressType} from './shared/utils/progress-shower.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent, Toast, ProgressBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit, OnDestroy {

  toastSubscription!: Subscription;
  readonly messageService: MessageService = inject(MessageService);
  readonly toast: ToastService = inject(ToastService);
  readonly progressShower: ProgressShowerService = inject(ProgressShowerService);
  readonly progress: Signal<number> = this.progressShower.progress;
  readonly progressType: Signal<ProgressType> = this.progressShower.progressType;

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
