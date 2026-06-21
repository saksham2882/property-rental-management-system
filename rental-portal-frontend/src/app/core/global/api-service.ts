import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from './logger-service';
import { ToastService } from '../services/toast-service';

@Injectable({ 
  providedIn: 'root' 
})
export class ApiService {
  
  private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private toast: ToastService
  ) { }

  private logAndHandleError(method: string, url: string, error: HttpErrorResponse): Observable<never> {
    const errorMsg = error.error?.message || error.message || 'Server error';
    this.logger.error(`[API ERROR] ${method} ${url} failed: [${error.status}] ${errorMsg}`);

    if (error.status !== 401 && error.status !== 403 && error.status !== 0) {
      this.toast.error(errorMsg);
    }
    return throwError(() => error);
  }

  get<T>(path: string, options?: any): Observable<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    return (this.http.get<T>(url, options) as unknown as Observable<T>).pipe(
      catchError(error => this.logAndHandleError('GET', url, error))
    );
  }

  post<T>(path: string, body: any, options?: any): Observable<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    return (this.http.post<T>(url, body, options) as unknown as Observable<T>).pipe(
      catchError(error => this.logAndHandleError('POST', url, error))
    );
  }

  put<T>(path: string, body: any, options?: any): Observable<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    return (this.http.put<T>(url, body, options) as unknown as Observable<T>).pipe(
      catchError(error => this.logAndHandleError('PUT', url, error))
    );
  }

  patch<T>(path: string, body: any, options?: any): Observable<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    return (this.http.patch<T>(url, body, options) as unknown as Observable<T>).pipe(
      catchError(error => this.logAndHandleError('PATCH', url, error))
    );
  }

  delete<T>(path: string, options?: any): Observable<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    return (this.http.delete<T>(url, options) as unknown as Observable<T>).pipe(
      catchError(error => this.logAndHandleError('DELETE', url, error))
    );
  }
}
