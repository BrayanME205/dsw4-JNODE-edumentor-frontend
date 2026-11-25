import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Sesion } from '../../../../core/models/sesion.model';
import { Tutor } from '../../../../core/models/tutor.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EstrellasComponent } from '../../../../shared/components/estrellas/estrellas.component';
import { SesionItemComponent } from '../../../tutorias/components/sesion-item/sesion-item.component';

/** Inicio del TUTOR: solicitudes por responder, próximas sesiones y su calificación. */
@Component({
  selector: 'app-inicio-tutor',
  standalone: true,
  imports: [RouterLink, TranslateModule, CargandoComponent, EstrellasComponent, SesionItemComponent],
  templateUrl: './inicio-tutor.component.html'
})
export class InicioTutorComponent implements OnInit {
  private readonly sesionService = inject(SesionService);
  private readonly tutorService = inject(TutorService);
  readonly usuario = inject(AuthService).usuario;

  readonly sesiones = signal<Sesion[]>([]);
  readonly perfil = signal<Tutor | null>(null);
  readonly cargando = signal(true);

  readonly pendientes = computed(() =>
    this.sesiones().filter((s) => s.estado === 'REQUESTED').sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
  );
  readonly proximas = computed(() =>
    this.sesiones()
      .filter((s) => s.estado === 'CONFIRMED' || s.estado === 'IN_SESSION')
      .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
      .slice(0, 3)
  );

  ngOnInit(): void {
    const id = this.usuario()?.usuarioId;
    if (id) this.tutorService.obtener(id).subscribe({ next: (t) => this.perfil.set(t), error: () => this.perfil.set(null) });
    this.cargar();
  }

  cargar(): void {
    this.sesionService.mias().subscribe({
      next: (lista) => {
        this.sesiones.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
