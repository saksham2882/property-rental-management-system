import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache-service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  if (req.method !== 'GET') {
    cacheService.clear();
    return next(req); 
  }

  // Only cache standard GET listings/details for properties, leases, and rents
  const isCacheable = req.url.includes('/properties') || req.url.includes('/leases') || req.url.includes('/rents');
  if (!isCacheable) {
    return next(req);
  }

  const cachedResponse = cacheService.get(req.urlWithParams);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.put(req.urlWithParams, event);
      }
    })
  );
};
