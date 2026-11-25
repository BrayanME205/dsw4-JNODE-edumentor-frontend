import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Sesion, SolicitudSesionRequest } from '../models/sesion.model';

/** Ciclo de vida de las tutorías (/api/sesiones). Cada acción la valida también el backend. */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/sesiones`;

  /** ESTUDIANTE: crea una solicitud (queda REQUESTED). */
  solicitar(datos: SolicitudSesionRequest): Observable<Sesion> {
    return this.http.post<Sesion>(this.url, datos);
  }

  /** Estudiante: las suyas. Tutor: las que le pidieron. Coordinador: todas. */
  mias(): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(`${this.url}/mias`);
  }

  obtener(id: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.url}/${id}`);
  }

  /** TUTOR. Responde 409 si se cruza con otra sesión (y el backend la deja REJECTED). */
  aceptar(id: number): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.url}/${id}/aceptar`, {});
  }

  rechazar(id: number): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.url}/${id}/rechazar`, {});
  }

  /** Responde 422 si falta menos de 2 horas para una sesión confirmada. */
  cancelar(id: number): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.url}/${id}/cancelar`, {});
  }

  iniciar(id: number): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.url}/${id}/iniciar`, {});
  }

  finalizar(id: number, resumen: string): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.url}/${id}/finalizar`, { resumen });
  }
}
