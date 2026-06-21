import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RentalApplication } from '../models/application-model';
import { ApiService } from '../global/api-service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiPath = '/applications';
  private api = inject(ApiService);

  getAll(): Observable<RentalApplication[]> {
    return this.api.get<RentalApplication[]>(this.apiPath);
  }

  getById(id: any): Observable<RentalApplication> {
    return this.api.get<RentalApplication>(`${this.apiPath}/${id}`);
  }

  getByCustomer(customerId: any): Observable<RentalApplication[]> {
    return this.api.get<RentalApplication[]>(`${this.apiPath}?customerId=${customerId}`);
  }

  getByProperty(propertyId: any): Observable<RentalApplication[]> {
    return this.api.get<RentalApplication[]>(`${this.apiPath}?propertyId=${propertyId}`);
  }

  submit(app: RentalApplication): Observable<RentalApplication> {
    const payload = {
      ...app,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'under_review'
    };
    return this.api.post<RentalApplication>(this.apiPath, payload);
  }

  updateStatus(id: any, status: string): Observable<RentalApplication> {
    return this.api.patch<RentalApplication>(`${this.apiPath}/${id}`, { status });
  }

  delete(id: any): Observable<void> {
    return this.api.delete<void>(`${this.apiPath}/${id}`);
  }
}
