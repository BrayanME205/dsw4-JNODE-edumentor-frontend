import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  texto: string;
  tipo: 'exito' | 'error';
}

/** Avisos breves ("Tutoría solicitada") que aparecen abajo a la derecha y se van solos. */
@Injectable({ providedIn: 'root' })
export class AvisoService {
  private siguienteId = 1;
  readonly avisos = signal<Aviso[]>([]);

  mostrar(texto: string, tipo: Aviso['tipo'] = 'exito'): void {
    const aviso: Aviso = { id: this.siguienteId++, texto, tipo };
    this.avisos.update((lista) => [...lista, aviso]);
    setTimeout(() => this.cerrar(aviso.id), 5000);
  }

  cerrar(id: number): void {
    this.avisos.update((lista) => lista.filter((a) => a.id !== id));
  }
}
