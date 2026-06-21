import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class AnalyticsService {

  private api = inject(ApiService);

  getAdminStats(): Observable<any> {
    return this.api.get<any>('/analytics/admin');
  }

  getCustomerStats(userId: string): Observable<any> {
    return this.api.get<any>(`/analytics/customer/${userId}`);
  }
}
