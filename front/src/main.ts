import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { importProvidersFrom } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import '@angular/compiler';
import { authInterceptor } from './app/api/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideCharts(withDefaultRegisterables()),

    // Suporte a Markdown (standalone)
    importProvidersFrom(
      MarkdownModule.forRoot()
    )
  ]
}).catch(err => console.error(err));
