import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { provideCharts } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideRouter(routes),
    provideCharts()
  ]
};

