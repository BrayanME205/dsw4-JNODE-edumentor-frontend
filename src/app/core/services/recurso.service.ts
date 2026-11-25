import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Recurso, RecursoRequest } from '../models/recurso.model';

/** Recursos de una sesión. Solo los participantes pueden verlos o agregarlos. */
@Injectable({ providedIn: 'root' })
export class RecursoService {
  private readonly http = inject(HttpClient);

  private url(sesionId: number): string {
    return `${environment.apiUrl}/sesiones/${sesionId}/recursos`;
  }

  listar(sesionId: number): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(this.url(sesionId));
  }

  /** Responde 422 si la sesión no está confirmada ni realizada. */
  agregar(sesionId: number, datos: RecursoRequest): Observable<Recurso> {
    return this.http.post<Recurso>(this.url(sesionId), datos);
  }
}
