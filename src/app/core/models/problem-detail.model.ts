/** Formato de error RFC 7807 que devuelve el backend en todas sus respuestas de error. */
export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  /** Solo en errores 400 de validación: mensaje por campo. */
  errors?: Record<string, string>;
}
