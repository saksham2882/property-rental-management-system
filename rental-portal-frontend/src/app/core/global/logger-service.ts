import { Injectable } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class LoggerService {

  error(message: string, ...optionalParams: any[]) {
    console.error(`%c[ERROR] %c${message}`, 'color: #ef4444; font-weight: bold;', 'color: inherit;', ...optionalParams);
  }
}
