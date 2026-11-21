import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { routes } from './app.routes';
import { TituloTraducido, crearCargadorTraducciones } from './core/config/traducciones';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: { provide: TranslateLoader, useFactory: crearCargadorTraducciones, deps: [HttpClient] }
      })
    ),
    // La app espera a que el archivo de textos esté cargado antes de pintarse
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const translate = inject(TranslateService);
        return () => translate.use('es');
      }
    },
    { provide: TitleStrategy, useClass: TituloTraducido }
  ]
};
