import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  readonly bottomNavBarHeight: WritableSignal<number> = signal(0);
}
