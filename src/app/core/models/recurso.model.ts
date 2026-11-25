/** Material de estudio compartido en una tutoría (RecursoResponse). */
export interface Recurso {
  id: number;
  sesionId: number;
  titulo: string;
  urlRecurso: string;
  tipoArchivo: string | null;
}

export type RecursoRequest = Omit<Recurso, 'id' | 'sesionId'>;
