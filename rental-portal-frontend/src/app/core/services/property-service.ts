import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyFilter } from '../models/property-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class PropertyService {

  private apiPath = '/properties';
  private api = inject(ApiService);

  getAll(): Observable<Property[]> {
    return this.api.get<Property[]>(this.apiPath);
  }

  getById(id: any): Observable<Property> {
    return this.api.get<Property>(`${this.apiPath}/${id}`);
  }

  getFiltered(filters: PropertyFilter): Observable<Property[]> {
    let params = new HttpParams();
    if (filters.city) params = params.set('city', filters.city);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.bedrooms) params = params.set('bedrooms', filters.bedrooms.toString());
    if (filters.furnishing) params = params.set('furnishing', filters.furnishing);
    if (filters.available !== undefined) params = params.set('available', String(filters.available));
    if (filters.minRent !== undefined) params = params.set('rentMin', filters.minRent.toString());
    if (filters.maxRent !== undefined) params = params.set('rentMax', filters.maxRent.toString());
    if (filters.search) params = params.set('search', filters.search);
    return this.api.get<Property[]>(this.apiPath, { params });
  }

  create(property: Partial<Property>): Observable<Property> {
    return this.api.post<Property>(this.apiPath, property);
  }

  update(id: any, data: Partial<Property>): Observable<Property> {
    return this.api.patch<Property>(`${this.apiPath}/${id}`, data);
  }

  delete(id: any): Observable<void> {
    return this.api.delete<void>(`${this.apiPath}/${id}`);
  }

  getReviews(propertyId: any): Observable<any[]> {
    return this.api.get<any[]>(`${this.apiPath}/${propertyId}/reviews`);
  }

  addReview(propertyId: any, review: any): Observable<any> {
    return this.api.post<any>(`${this.apiPath}/${propertyId}/reviews`, review);
  }
}
