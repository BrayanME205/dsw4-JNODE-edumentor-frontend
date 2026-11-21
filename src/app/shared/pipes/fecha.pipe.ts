import { formatDate } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Formatea fechas en el idioma activo (es / en).
 * Es "impuro" para que se actualice al cambiar de idioma sin recargar.
 * Ejemplo: {{ sesion.fechaHora | fecha:'EEEE d MMM, HH:mm' }}
 */
@Pipe({ name: 'fecha', standalone: true, pure: false })
export class FechaPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(valor: string | Date | null | undefined, formato = 'EEEE d MMM, HH:mm'): string {
    if (!valor) {
      return '';
    }
    const idioma = this.translate.currentLang || this.translate.defaultLang || 'es';
    return formatDate(valor, formato, idioma === 'en' ? 'en-US' : 'es');
  }
}
