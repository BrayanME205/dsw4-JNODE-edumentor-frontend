import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Formatos de fecha en español (el inglés viene incluido en Angular)
registerLocaleData(localeEs, 'es');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
