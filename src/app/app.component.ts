import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationRailComponent} from './navigation-rail/navigation-rail.component';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ToastService} from './shared/utils/toast.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {

  toastSubscription!: Subscription;

  constructor(readonly messageService: MessageService, readonly toast: ToastService) {

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

