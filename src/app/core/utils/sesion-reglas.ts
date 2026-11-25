import { Rol } from '../models/auth.model';
import { EstadoTutoria, Sesion } from '../models/sesion.model';

/**
 * Reglas de la máquina de estados, del lado del cliente.
 * Solo sirven para decidir qué botones mostrar: la validación real la hace el backend.
 */

export type AccionSesion = 'aceptar' | 'rechazar' | 'cancelar' | 'iniciar' | 'finalizar' | 'evaluar';

/** Recorrido "feliz" que dibuja la ruta de estados. */
export const RUTA: EstadoTutoria[] = ['REQUESTED', 'CONFIRMED', 'IN_SESSION', 'COMPLETED', 'REVIEWED'];

/** Estados que ocupan la agenda (igual que OCUPAN_AGENDA en el backend). */
export const ACTIVOS: EstadoTutoria[] = ['REQUESTED', 'CONFIRMED', 'IN_SESSION'];

export const HORAS_MINIMAS_CANCELACION = 2;

/** Sufijo de la clase .em-badge--* para cada estado. */
export function claseEstado(estado: EstadoTutoria): string {
  const clases: Record<EstadoTutoria, string> = {
    REQUESTED: 'solicitada',
    CONFIRMED: 'confirmada',
    IN_SESSION: 'en-sesion',
    COMPLETED: 'completada',
    REVIEWED: 'evaluada',
    REJECTED: 'cerrada',
    CANCELLED: 'cerrada'
  };
  return clases[estado];
}

/** ¿Falta al menos 2 horas para que empiece? */
export function aTiempoDeCancelar(sesion: Sesion, ahora = new Date()): boolean {
  const limite = new Date(sesion.fechaHora).getTime() - HORAS_MINIMAS_CANCELACION * 3600_000;
  return ahora.getTime() <= limite;
}

/** Acciones que el usuario puede intentar sobre la sesión, según su rol y el estado. */
export function accionesDisponibles(sesion: Sesion, rol: Rol | null, ahora = new Date()): AccionSesion[] {
  const yaEmpezo = new Date(sesion.fechaHora).getTime() <= ahora.getTime();
  if (rol === 'TUTOR') {
    switch (sesion.estado) {
      case 'REQUESTED':
        return ['aceptar', 'rechazar'];
      case 'CONFIRMED':
        return [...(yaEmpezo ? ['iniciar' as const] : []), ...(aTiempoDeCancelar(sesion, ahora) ? ['cancelar' as const] : [])];
      case 'IN_SESSION':
        return ['finalizar'];
      default:
        return [];
    }
  }
  if (rol === 'ESTUDIANTE') {
    switch (sesion.estado) {
      case 'REQUESTED':
        return ['cancelar'];
      case 'CONFIRMED':
        return aTiempoDeCancelar(sesion, ahora) ? ['cancelar'] : [];
      case 'COMPLETED':
        return ['evaluar'];
      default:
        return [];
    }
  }
  return []; // El coordinador solo supervisa
}

/**
 * Date → "2026-11-25T15:00:00" en hora LOCAL.
 * No usamos toISOString() porque convierte a UTC y el backend espera LocalDateTime.
 */
export function aFechaLocal(fecha: Date): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:00`;
}
