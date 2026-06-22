import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
      default:
        toast.info(message);
        break;
    }
  }

  success(message: string) {
    toast.success(message);
  }

  error(message: string) {
    toast.error(message);
  }

  info(message: string) {
    toast.info(message);
  }

  dismiss(id?: string | number) {
    toast.dismiss(id);
  }
}
