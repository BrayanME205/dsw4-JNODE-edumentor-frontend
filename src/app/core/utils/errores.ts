import { HttpErrorResponse } from '@angular/common/http';

import { ProblemDetail } from '../models/problem-detail.model';

function esProblemDetail(cuerpo: unknown): cuerpo is ProblemDetail {
  return typeof cuerpo === 'object' && cuerpo !== null && 'detail' in cuerpo;
}

/**
 * Devuelve el texto que se le muestra al usuario ante un error HTTP:
 * el "detail" del ProblemDetail si viene, o una clave de traducción genérica.
 * El componente decide si traduce la clave con el pipe translate.
 */
export function mensajeDeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'COMUN.ERROR_CONEXION';
    }
    if (esProblemDetail(error.error) && error.error.detail) {
      return error.error.detail;
    }
  }
  return 'COMUN.ERROR_GENERICO';
}
