import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader-service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {

  const loaderService = inject(LoaderService);

  const isMutation = req.method !== 'GET';
  const isBackground = req.url.includes('/messages/received') || req.url.includes('/notifications?userId=');
  const shouldShowLoader = isMutation && !isBackground;

  if (shouldShowLoader) {
    loaderService.show();
  } 

  return next(req).pipe(
    finalize(() => {
      if (shouldShowLoader) {
        loaderService.hide();
      }
    })
  );
};
