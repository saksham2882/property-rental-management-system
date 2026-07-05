import { Injectable, signal } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class LoaderService {

  private activeRequests = 0;
  loading = signal(false);

  show() {
    this.activeRequests++;
    this.loading.set(true);
  }

  hide() {
    this.activeRequests--; 
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.loading.set(false);
    }
  }
}