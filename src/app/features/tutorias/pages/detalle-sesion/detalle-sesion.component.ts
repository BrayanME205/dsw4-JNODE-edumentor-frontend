import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Sesion } from '../../../../core/models/sesion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AvisoService } from '../../../../core/services/aviso.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { accionesDisponibles, aTiempoDeCancelar } from '../../../../core/utils/sesion-reglas';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EstadoBadgeComponent } from '../../../../shared/components/estado-badge/estado-badge.component';
import { FechaPipe } from '../../../../shared/pipes/fecha.pipe';
import { EvaluacionSesionComponent } from '../../components/evaluacion-sesion/evaluacion-sesion.component';
import { RecursosSesionComponent } from '../../components/recursos-sesion/recursos-sesion.component';
import { AccionesSesionComponent } from '../../components/acciones-sesion/acciones-sesion.component';
import { RutaEstadoComponent } from '../../components/ruta-estado/ruta-estado.component';

/** Detalle de una tutoría: ruta de estados, datos, acciones y (para el tutor) el formulario de finalizar. */
@Component({
  selector: 'app-detalle-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, AlertaComponent, AvatarComponent, CargandoComponent, EstadoBadgeComponent, FechaPipe, AccionesSesionComponent, RutaEstadoComponent, EvaluacionSesionComponent, RecursosSesionComponent],
  templateUrl: './detalle-sesion.component.html',
  styleUrl: './detalle-sesion.component.css'
})
export class DetalleSesionComponent implements OnInit {
  private readonly ruta = inject(ActivatedRoute);
  private readonly sesionService = inject(SesionService);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);

  readonly rol = this.auth.rol;
  readonly sesion = signal<Sesion | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly finalizando = signal(false);
  readonly errorFinalizar = signal('');

  readonly puedeFinalizar = computed(() => {
    const s = this.sesion();
    return s !== null && accionesDisponibles(s, this.rol()).includes('finalizar');
  });

  /** Confirmada pero ya dentro de las 2 horas previas: no se puede cancelar. */
  readonly fueraDePlazo = computed(() => {
    const s = this.sesion();
    return s !== null && s.estado === 'CONFIRMED' && this.rol() !== 'COORDINADOR' && !aTiempoDeCancelar(s);
  });

  readonly formFinalizar = this.fb.nonNullable.group({
    resumen: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    this.sesionService.obtener(id).subscribe({
      next: (sesion) => {
        this.sesion.set(sesion);
        this.cargando.set(false);
        this.irAlFragmento();
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
  }

  /** Si se llegó con #finalizar o #evaluar, baja hasta esa sección cuando ya se dibujó. */
  private irAlFragmento(): void {
    const fragmento = this.ruta.snapshot.fragment;
    if (fragmento) setTimeout(() => document.getElementById(fragmento)?.scrollIntoView({ behavior: 'smooth' }));
  }

  finalizar(): void {
    const sesion = this.sesion();
    if (!sesion || this.formFinalizar.invalid) {
      this.formFinalizar.markAllAsTouched();
      return;
    }
    this.finalizando.set(true);
    this.errorFinalizar.set('');
    this.sesionService.finalizar(sesion.id, this.formFinalizar.getRawValue().resumen).subscribe({
      next: (actualizada) => {
        this.sesion.set(actualizada);
        this.finalizando.set(false);
        this.avisos.mostrar(this.translate.instant('ACCIONES.HECHO_FINALIZAR'));
      },
      error: (err: unknown) => {
        this.errorFinalizar.set(mensajeDeError(err));
        this.finalizando.set(false);
      }
    });
  }
}
