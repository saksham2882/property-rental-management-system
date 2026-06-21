import { ErrorHandler, Injectable } from '@angular/core';
import { ToastService } from '../services/toast-service';
import { LoggerService } from './logger-service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor (
    private logger: LoggerService, 
    private toast: ToastService
  ) { }

  handleError(error: any): void {
    const message = error.message || error.toString();
    this.logger.error(`Unhandled Exception occurred: ${message}`, error);

    setTimeout(() => {
      this.toast.error('An unexpected error occurred. Please try again.');
    });
  }
}
