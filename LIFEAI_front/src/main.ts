import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import '@angular/compiler';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(), provideCharts(withDefaultRegisterables())
  ]
}).catch(err => console.error(err));