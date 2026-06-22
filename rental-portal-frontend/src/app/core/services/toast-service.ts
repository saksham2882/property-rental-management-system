import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ 
  providedIn: 'root' 
})
export class ToastService {

  toasts = signal<Toast[]>([]);
  private nextId = 0;
  private autoClearTimeout: any = null;


  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = this.nextId++;
    
    this.toasts.update(list => {
      const newList = [...list, { id, message, type }];
      if (newList.length > 5) {
        newList.shift();
      }
      return newList;
    });

    setTimeout(() => this.dismiss(id), 30000);
    this.resetAutoClearTimer();
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
    this.resetAutoClearTimer();
  }

  clearAll() {
    this.toasts.set([]);
    if (this.autoClearTimeout) {
      clearTimeout(this.autoClearTimeout);
      this.autoClearTimeout = null;
    }
  }

  private resetAutoClearTimer() {
    if (this.autoClearTimeout) {
      clearTimeout(this.autoClearTimeout);
    }
    this.autoClearTimeout = setTimeout(() => {
      this.toasts.set([]);
    }, 30000);
  }
}
