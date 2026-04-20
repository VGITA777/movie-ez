import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private readonly isLoggingEnabled: boolean = environment.isLoggingEnabled;

  log(message: any, ...optionalParams: any[]): void {
    if (!this.isLoggingEnabled) {
      return;
    }

    if (optionalParams.length > 0) {
      console.log(message, ...optionalParams);
    } else {
      console.log(message);
    }
  }

  error(message: any, error?: any, ...optionalParams: any[]): void {
    if (!this.isLoggingEnabled) {
      return;
    }

    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }

  warning(message: any, ...optionalParams: any[]): void {
    if (!this.isLoggingEnabled) {
      return;
    }

    if (optionalParams.length > 0) {
      console.warn(message, ...optionalParams);
    } else {
      console.warn(message);
    }
  }

  debug(message: any, ...optionalParams: any[]): void {
    if (!this.isLoggingEnabled) {
      return;
    }

    if (optionalParams.length > 0) {
      console.debug(message, ...optionalParams);
    } else {
      console.debug(message);
    }
  }
}
