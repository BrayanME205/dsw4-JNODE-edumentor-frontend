import { Pipe, PipeTransform } from '@angular/core';

/** "Ana Mora" -> "AM". Se usa en los avatares (no hay fotos de personas). */
@Pipe({ name: 'iniciales', standalone: true })
export class InicialesPipe implements PipeTransform {
  transform(nombre: string | null | undefined): string {
    if (!nombre) {
      return '';
    }
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join('');
  }
}
