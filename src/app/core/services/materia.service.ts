import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Materia, MateriaRequest } from '../models/materia.model';

/** Acceso a /api/materias. Consultar es público; crear, editar y eliminar es del COORDINADOR. */
@Injectable({ providedIn: 'root' })
export class MateriaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/materias`;

  listar(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.url);
  }

  obtener(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.url}/${id}`);
  }

  crear(datos: MateriaRequest): Observable<Materia> {
    return this.http.post<Materia>(this.url, datos);
  }

  actualizar(id: number, datos: MateriaRequest): Observable<Materia> {
    return this.http.put<Materia>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
