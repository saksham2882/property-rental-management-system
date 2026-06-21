import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rent } from '../models/rent-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class RentService {

  private apiPath = '/rents';
  private api = inject(ApiService);

  getAll(): Observable<Rent[]> {
    return this.api.get<Rent[]>(this.apiPath);
  }

  getByTenant(tenantId: any, status?: string): Observable<Rent[]> {
    let path = `${this.apiPath}?tenantId=${tenantId}`;
    if (status) {
      path += `&status=${status}`;
    }
    return this.api.get<Rent[]>(path);
  }

  markPaid(id: any): Observable<Rent> {
    return this.api.post<Rent>(`${this.apiPath}/${id}/pay`, {});
  }

  initiateOrder(id: any): Observable<any> {
    return this.api.post<any>(`${this.apiPath}/${id}/order`, {});
  }

  verifyPayment(id: any, payload: any): Observable<Rent> {
    return this.api.post<Rent>(`${this.apiPath}/${id}/verify`, payload);
  }

  create(rent: Partial<Rent>): Observable<Rent> {
    return this.api.post<Rent>(this.apiPath, rent);
  }

  update(id: any, data: Partial<Rent>): Observable<Rent> {
    return this.api.patch<Rent>(`${this.apiPath}/${id}`, data);
  }

  downloadInvoice(id: any): Observable<Blob> {
    return this.api.get(`${this.apiPath}/${id}/invoice`, { responseType: 'blob' });
  }
}
