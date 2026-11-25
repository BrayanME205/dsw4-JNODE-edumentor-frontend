import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { Disponibilidad } from '../../../../core/models/disponibilidad.model';
import { Tutor } from '../../../../core/models/tutor.model';
import { AuthService } from '../../../../core/services/auth.service';
import { DisponibilidadService } from '../../../../core/services/disponibilidad.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EstrellasComponent } from '../../../../shared/components/estrellas/estrellas.component';
import { HorarioSemanalComponent } from '../../../../shared/components/horario-semanal/horario-semanal.component';

/** Perfil público de un tutor: datos, calificación y horario semanal. */
@Component({
  selector: 'app-perfil-tutor',
  standalone: true,
  imports: [RouterLink, TranslateModule, AlertaComponent, AvatarComponent, CargandoComponent, EstrellasComponent, HorarioSemanalComponent],
  templateUrl: './perfil-tutor.component.html',
  styleUrl: './perfil-tutor.component.css'
})
export class PerfilTutorComponent implements OnInit {
  private readonly ruta = inject(ActivatedRoute);
  private readonly tutorService = inject(TutorService);
  private readonly disponibilidadService = inject(DisponibilidadService);
  private readonly auth = inject(AuthService);

  readonly tutor = signal<Tutor | null>(null);
  readonly bloques = signal<Disponibilidad[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  /** Solo un visitante o un estudiante puede reservar. */
  readonly puedeReservar = computed(() => !this.auth.autenticado() || this.auth.rol() === 'ESTUDIANTE');

  ngOnInit(): void {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    forkJoin({
      tutor: this.tutorService.obtener(id),
      bloques: this.disponibilidadService.listarPorTutor(id)
    }).subscribe({
      next: ({ tutor, bloques }) => {
        this.tutor.set(tutor);
        this.bloques.set(bloques);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
  }
}
