import {Injectable} from '@angular/core';
import {ToastMessageOptions} from 'primeng/api';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly _message = new BehaviorSubject<ToastMessageOptions | undefined>(undefined);
  readonly message: Observable<ToastMessageOptions | undefined> = this._message.asObservable();

  showToast(message: ToastMessageOptions) {
    this._message.next(message);
  }

  showSuccessToast(summary: string, detail: string) {
    this.showToast({
      severity: 'success',
      summary: summary,
      detail: detail,
    });
  }

  showErrorToast(summary: string, detail: string) {
    this.showToast({
      severity: 'danger',
      summary: summary,
      detail: detail,
    });
  }

  showInfoToast(summary: string, detail: string) {
    this.showToast({
      severity: 'info',
      summary: summary,
      detail: detail,
    });
  }

  showWarnToast(summary: string, detail: string) {
    this.showToast({
      severity: 'warn',
      summary: summary,
      detail: detail,
    });
  }

  showSecondaryToast(summary: string, detail: string) {
    this.showToast({
      severity: 'secondary',
      summary: summary,
      detail: detail,
    });
  }

  showContrastToast(summary: string, detail: string) {
    this.showToast({
      severity: 'contrast',
      summary: summary,
      detail: detail,
    });
  }
}
