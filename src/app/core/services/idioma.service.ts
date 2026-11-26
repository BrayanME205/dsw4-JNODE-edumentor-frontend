import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type Idioma = 'es' | 'en';

const CLAVE_IDIOMA = 'edumentor_idioma';

/** Idioma de la interfaz: lo recuerda en localStorage y actualiza <html lang> para los lectores de pantalla. */
@Injectable({ providedIn: 'root' })
export class IdiomaService {
  private readonly translate = inject(TranslateService);
  private readonly documento = inject(DOCUMENT);

  readonly idiomas: Idioma[] = ['es', 'en'];
  readonly actual = signal<Idioma>(this.leerGuardado());

  /** Se llama al arrancar la app (APP_INITIALIZER): carga el archivo de textos antes de pintar. */
  inicializar(): Observable<unknown> {
    this.documento.documentElement.lang = this.actual();
    return this.translate.use(this.actual());
  }

  cambiar(idioma: Idioma): void {
    this.actual.set(idioma);
    localStorage.setItem(CLAVE_IDIOMA, idioma);
    this.documento.documentElement.lang = idioma;
    this.translate.use(idioma);
  }

  private leerGuardado(): Idioma {
    const guardado = localStorage.getItem(CLAVE_IDIOMA);
    return guardado === 'en' ? 'en' : 'es';
  }
}
