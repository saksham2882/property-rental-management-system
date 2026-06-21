import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lease } from '../models/lease-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class LeaseService {

  private apiPath = '/leases';
  private api = inject(ApiService);

  getAll(): Observable<Lease[]> {
    return this.api.get<Lease[]>(this.apiPath);
  }

  getByTenant(tenantId: any): Observable<Lease[]> {
    return this.api.get<Lease[]>(`${this.apiPath}?tenantId=${tenantId}`);
  }

  getById(id: any): Observable<Lease> {
    return this.api.get<Lease>(`${this.apiPath}/${id}`);
  }

  create(lease: Partial<Lease>): Observable<Lease> {
    return this.api.post<Lease>(this.apiPath, lease);
  }

  update(id: any, data: Partial<Lease>): Observable<Lease> {
    return this.api.patch<Lease>(`${this.apiPath}/${id}`, data);
  }

  signLease(id: any, signatureImage: string): Observable<Lease> {
    return this.api.post<Lease>(`${this.apiPath}/${id}/sign`, { signatureImage });
  }
}
