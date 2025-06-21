import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MarkdownModule } from 'ngx-markdown';
import { AuthInterceptor } from './api/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      CommonModule,
      MarkdownModule.forRoot()
    ),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
};
