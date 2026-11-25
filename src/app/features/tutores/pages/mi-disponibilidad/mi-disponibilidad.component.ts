import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DiaSemana, Disponibilidad } from '../../../../core/models/disponibilidad.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AvisoService } from '../../../../core/services/aviso.service';
import { DisponibilidadService } from '../../../../core/services/disponibilidad.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { DIAS } from '../../../../core/utils/horario';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { ConfirmarDialogoComponent } from '../../../../shared/components/confirmar-dialogo/confirmar-dialogo.component';
import { EncabezadoPaginaComponent } from '../../../../shared/components/encabezado-pagina/encabezado-pagina.component';
import { HorarioSemanalComponent } from '../../../../shared/components/horario-semanal/horario-semanal.component';

/** Validador de grupo: la hora de fin tiene que ser posterior a la de inicio. */
function finDespuesDeInicio(grupo: AbstractControl): ValidationErrors | null {
  const { horaInicio, horaFin } = grupo.value as { horaInicio: string; horaFin: string };
  return horaInicio && horaFin && horaFin <= horaInicio ? { rangoInvalido: true } : null;
}

/** El TUTOR administra sus bloques semanales de disponibilidad. */
@Component({
  selector: 'app-mi-disponibilidad',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, AlertaComponent, CargandoComponent, ConfirmarDialogoComponent, EncabezadoPaginaComponent, HorarioSemanalComponent],
  templateUrl: './mi-disponibilidad.component.html',
  styleUrl: './mi-disponibilidad.component.css'
})
export class MiDisponibilidadComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly disponibilidadService = inject(DisponibilidadService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);

  readonly dias = DIAS;
  readonly bloques = signal<Disponibilidad[]>([]);
  readonly cargando = signal(true);
  readonly errorLista = signal('');
  readonly editando = signal<Disponibilidad | null>(null);
  readonly guardando = signal(false);
  readonly errorForm = signal('');
  readonly porQuitar = signal<Disponibilidad | null>(null);

  /** Bloques agrupados por día, solo los días que tienen alguno. */
  readonly porDia = computed(() =>
    DIAS.map((dia) => ({ dia, bloques: this.bloques().filter((b) => b.diaSemana === dia) })).filter((g) => g.bloques.length > 0)
  );

  readonly form = this.fb.nonNullable.group(
    {
      diaSemana: ['MONDAY' as DiaSemana, Validators.required],
      horaInicio: ['08:00', Validators.required],
      horaFin: ['10:00', Validators.required]
    },
    { validators: finDespuesDeInicio }
  );

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const tutorId = this.auth.usuario()?.usuarioId;
    if (!tutorId) return;
    this.cargando.set(true);
    this.errorLista.set('');
    this.disponibilidadService.listarPorTutor(tutorId).subscribe({
      next: (lista) => {
        this.bloques.set(lista);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.errorLista.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
  }

  /** "13:00:00" → "13:00" (el input type="time" usa HH:mm). */
  hora(valor: string): string {
    return valor.slice(0, 5);
  }

  editar(bloque: Disponibilidad): void {
    this.editando.set(bloque);
    this.errorForm.set('');
    this.form.setValue({ diaSemana: bloque.diaSemana, horaInicio: this.hora(bloque.horaInicio), horaFin: this.hora(bloque.horaFin) });
  }

  nuevo(): void {
    this.editando.set(null);
    this.errorForm.set('');
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.errorForm.set('');
    const datos = this.form.getRawValue();
    const actual = this.editando();
    const peticion = actual ? this.disponibilidadService.actualizar(actual.id, datos) : this.disponibilidadService.crear(datos);
    peticion.subscribe({
      next: () => {
        this.avisos.mostrar(this.translate.instant(actual ? 'DISPONIBILIDAD.ACTUALIZADO' : 'DISPONIBILIDAD.AGREGADO'));
        this.guardando.set(false);
        this.nuevo();
        this.cargar();
      },
      // 422: el bloque se solapa con otro del mismo día
      error: (err: unknown) => {
        this.errorForm.set(mensajeDeError(err));
        this.guardando.set(false);
      }
    });
  }

  confirmarQuitar(): void {
    const bloque = this.porQuitar();
    this.porQuitar.set(null);
    if (!bloque) return;
    this.disponibilidadService.desactivar(bloque.id).subscribe({
      next: () => {
        this.avisos.mostrar(this.translate.instant('DISPONIBILIDAD.QUITADO'));
        if (this.editando()?.id === bloque.id) this.nuevo();
        this.cargar();
      },
      error: (err: unknown) => this.avisos.mostrar(this.translate.instant(mensajeDeError(err)), 'error')
    });
  }
}
