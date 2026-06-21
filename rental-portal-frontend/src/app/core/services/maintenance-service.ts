import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceRequest } from '../models/maintenance-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class MaintenanceService {

  private apiPath = '/maintenanceRequests';
  private api = inject(ApiService);

  getAll(): Observable<MaintenanceRequest[]> {
    return this.api.get<MaintenanceRequest[]>(this.apiPath);
  }

  getByTenant(tenantId: any): Observable<MaintenanceRequest[]> {
    return this.api.get<MaintenanceRequest[]>(`${this.apiPath}?tenantId=${tenantId}`);
  }

  submit(request: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    const payload = {
      ...request,
      status: 'pending',
      raisedAt: new Date().toISOString().split('T')[0],
      resolvedAt: null,
      adminNote: ''
    };
    return this.api.post<MaintenanceRequest>(this.apiPath, payload);
  }

  update(id: any, data: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    return this.api.patch<MaintenanceRequest>(`${this.apiPath}/${id}`, data);
  }
}
