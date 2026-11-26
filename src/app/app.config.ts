import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';
import { TituloTraducido, crearCargadorTraducciones } from './core/config/traducciones';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { IdiomaService } from './core/services/idioma.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: { provide: TranslateLoader, useFactory: crearCargadorTraducciones, deps: [HttpClient] }
      })
    ),
    // La app espera a que el archivo de textos (es o en, el último elegido) esté cargado antes de pintarse
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const idioma = inject(IdiomaService);
        return () => idioma.inicializar();
      }
    },
    { provide: TitleStrategy, useClass: TituloTraducido }
  ]
};
