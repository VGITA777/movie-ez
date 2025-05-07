import {Injectable, Signal, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressShowerService {

  private readonly _progress: WritableSignal<number> = signal(-1);
  readonly progress: Signal<number> = this._progress.asReadonly();

  private readonly _type: WritableSignal<ProgressType> = signal('hidden');
  readonly progressType: Signal<ProgressType> = this._type.asReadonly();

  updateProgress(value: number): void {
    this._progress.set(value);
  }

  show(type: ProgressType, value?: number): void {
    this._type.set(type);
    this._progress.set((type === 'default' && value !== undefined) ? value : -1);
  }

  hide(): void {
    this._progress.set(-1);
    this._type.set('hidden');
  }
}

export type ProgressType = 'hidden' | 'default' | 'indeterminate';
