/** Estados de la máquina de estados del backend (EstadoTutoria). */
export type EstadoTutoria = 'REQUESTED' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'IN_SESSION' | 'COMPLETED' | 'REVIEWED';

export type Modalidad = 'VIRTUAL' | 'PRESENCIAL';

/** SesionResponse del backend. Las fechas llegan como "2026-11-25T15:00:00" (hora local, sin zona). */
export interface Sesion {
  id: number;
  estudianteId: number;
  estudianteNombre: string;
  tutorId: number;
  tutorNombre: string;
  materiaId: number;
  materiaCodigo: string;
  materiaNombre: string;
  fechaHora: string;
  fechaHoraFin: string;
  duracionMinutos: number;
  estado: EstadoTutoria;
  modalidad: Modalidad;
  resumenTrabajo: string | null;
}

export interface SolicitudSesionRequest {
  tutorId: number;
  materiaId: number;
  fechaHora: string;
  duracionMinutos: number;
  modalidad: Modalidad;
}
