import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class UploadService {

  private apiPath = '/upload';
  private api = inject(ApiService);

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<{ url: string }>(this.apiPath, formData);
  }
}
