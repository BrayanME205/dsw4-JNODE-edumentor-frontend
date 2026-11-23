/** Materia del catálogo (MateriaResponse / MateriaRequest del backend). */
export interface Materia {
  id: number;
  codigoMateria: string;
  nombreMateria: string;
  carrera: string;
  creditos: number;
}

export type MateriaRequest = Omit<Materia, 'id'>;
