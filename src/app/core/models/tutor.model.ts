/** Tutor del catálogo público (TutorResponse del backend). */
export interface Tutor {
  id: number;
  nombre: string;
  apellido: string;
  /** Promedio de 0 a 5; es 0 si todavía no tiene evaluaciones. */
  promedioCalificacion: number;
  totalEvaluaciones: number;
}
