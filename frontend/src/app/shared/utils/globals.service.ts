import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  readonly bottomNavBarHeight: WritableSignal<number> = signal(0);
  readonly bottomNavBarHeightWithPadding: Signal<number> = computed(() => this.bottomNavBarHeight() + 14);
}
