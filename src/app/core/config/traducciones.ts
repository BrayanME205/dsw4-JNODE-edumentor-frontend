import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/** Carga los textos desde public/assets/i18n/<idioma>.json */
export function crearCargadorTraducciones(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

/**
 * Título de la pestaña traducido: cada ruta declara una clave (TITULOS.*)
 * y aquí se traduce y se le agrega el nombre del producto.
 */
@Injectable()
export class TituloTraducido extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const clave = this.buildTitle(snapshot);
    if (!clave) {
      this.title.setTitle('EduMentor Hub');
      return;
    }
    this.translate.get(clave).subscribe((texto: string) => this.title.setTitle(`${texto} · EduMentor Hub`));
  }
}
