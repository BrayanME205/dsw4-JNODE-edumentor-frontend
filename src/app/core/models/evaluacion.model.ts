/** Evaluación que deja el estudiante al terminar una tutoría (EvaluacionResponse). */
export interface Evaluacion {
  id: number;
  sesionId: number;
  calificacionEstrellas: number;
  comentario: string | null;
  fechaEvaluacion: string;
}

export interface EvaluacionRequest {
  calificacionEstrellas: number;
  comentario: string;
}
