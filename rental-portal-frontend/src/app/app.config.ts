import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { authInterceptor } from './core/interceptor/auth-interceptor';
import { GlobalErrorHandler } from './core/global/global-error-handler';
import { appReducers, appEffects } from './store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(appReducers),
    provideEffects(appEffects),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
};
