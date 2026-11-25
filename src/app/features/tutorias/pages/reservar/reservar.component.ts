import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { Disponibilidad } from '../../../../core/models/disponibilidad.model';
import { Materia } from '../../../../core/models/materia.model';
import { Modalidad, Sesion } from '../../../../core/models/sesion.model';
import { Tutor } from '../../../../core/models/tutor.model';
import { AvisoService } from '../../../../core/services/aviso.service';
import { DisponibilidadService } from '../../../../core/services/disponibilidad.service';
import { MateriaService } from '../../../../core/services/materia.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { claveBloque, cubreIntervalo, diaDe, fechaDelBloque, lunesDe } from '../../../../core/utils/horario';
import { ACTIVOS, aFechaLocal } from '../../../../core/utils/sesion-reglas';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EncabezadoPaginaComponent } from '../../../../shared/components/encabezado-pagina/encabezado-pagina.component';
import { BloqueElegido, HorarioSemanalComponent } from '../../../../shared/components/horario-semanal/horario-semanal.component';
import { FechaPipe } from '../../../../shared/pipes/fecha.pipe';

const SEMANAS_ADELANTE = 4;

/**
 * El ESTUDIANTE solicita una tutoría: materia → tutor → bloque del horario → duración y modalidad.
 * Acepta ?materia=ID y ?tutorId=ID para llegar con algo preseleccionado.
 */
@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, AlertaComponent, CargandoComponent, EncabezadoPaginaComponent, HorarioSemanalComponent, FechaPipe],
  templateUrl: './reservar.component.html',
  styleUrl: './reservar.component.css'
})
export class ReservarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly materiaService = inject(MateriaService);
  private readonly tutorService = inject(TutorService);
  private readonly disponibilidadService = inject(DisponibilidadService);
  private readonly sesionService = inject(SesionService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);

  readonly duraciones = [30, 60, 90, 120];
  readonly materias = signal<Materia[]>([]);
  readonly tutores = signal<Tutor[]>([]);
  readonly bloques = signal<Disponibilidad[]>([]);
  readonly misSesiones = signal<Sesion[]>([]);
  readonly lunes = signal(lunesDe(new Date()));
  readonly elegido = signal<BloqueElegido | null>(null);
  readonly cargando = signal(true);
  readonly cargandoHorario = signal(false);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly intentoEnviar = signal(false);

  readonly form = this.fb.group({
    materiaId: this.fb.control<number | null>(null, Validators.required),
    tutorId: this.fb.control<number | null>(null, Validators.required),
    duracionMinutos: this.fb.nonNullable.control(60),
    modalidad: this.fb.nonNullable.control<Modalidad>('VIRTUAL')
  });

  readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly materiaElegida = computed(() => this.materias().find((m) => m.id === this.valores().materiaId) ?? null);
  readonly tutorElegido = computed(() => this.tutores().find((t) => t.id === this.valores().tutorId) ?? null);
  readonly claveElegida = computed(() => {
    const b = this.elegido();
    return b ? claveBloque(b.dia, b.hora) : null;
  });
  readonly fechaElegida = computed(() => {
    const b = this.elegido();
    return b ? fechaDelBloque(this.lunes(), b.dia, b.hora) : null;
  });

  /** ¿La duración elegida cabe completa en el bloque del tutor? (el backend lo vuelve a validar) */
  readonly cabe = computed(() => {
    const b = this.elegido();
    const duracion = this.valores().duracionMinutos ?? 60;
    return !b || cubreIntervalo(this.bloques(), b.dia, b.hora * 60, b.hora * 60 + duracion);
  });

  /** Celdas de esta semana en las que ya tengo una tutoría activa. */
  readonly ocupados = computed(() => {
    const inicioSemana = this.lunes().getTime();
    const finSemana = inicioSemana + 7 * 86_400_000;
    const claves: string[] = [];
    for (const s of this.misSesiones()) {
      const inicio = new Date(s.fechaHora);
      const fin = new Date(s.fechaHoraFin);
      if (inicio.getTime() < inicioSemana || inicio.getTime() >= finSemana) continue;
      for (let h = inicio.getHours(); h < fin.getHours() + (fin.getMinutes() > 0 ? 1 : 0); h++) {
        claves.push(claveBloque(diaDe(inicio), h));
      }
    }
    return claves;
  });

  readonly esPrimeraSemana = computed(() => this.lunes().getTime() <= lunesDe(new Date()).getTime());
  readonly esUltimaSemana = computed(() => this.lunes().getTime() >= this.sumarSemanas(lunesDe(new Date()), SEMANAS_ADELANTE).getTime());

  ngOnInit(): void {
    forkJoin({ materias: this.materiaService.listar(), tutores: this.tutorService.listar(), mias: this.sesionService.mias() }).subscribe({
      next: ({ materias, tutores, mias }) => {
        this.materias.set(materias);
        this.tutores.set(tutores);
        this.misSesiones.set(mias.filter((s) => ACTIVOS.includes(s.estado)));
        this.cargando.set(false);
        this.aplicarPreseleccion();
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
    this.form.controls.tutorId.valueChanges.subscribe((id) => this.cargarHorario(id));
  }

  private aplicarPreseleccion(): void {
    const params = this.ruta.snapshot.queryParamMap;
    const materia = Number(params.get('materia'));
    const tutor = Number(params.get('tutorId'));
    if (this.materias().some((m) => m.id === materia)) this.form.controls.materiaId.setValue(materia);
    if (this.tutores().some((t) => t.id === tutor)) this.form.controls.tutorId.setValue(tutor);
  }

  private cargarHorario(tutorId: number | null): void {
    this.elegido.set(null);
    this.bloques.set([]);
    if (!tutorId) return;
    this.cargandoHorario.set(true);
    this.disponibilidadService.listarPorTutor(tutorId).subscribe({
      next: (bloques) => {
        this.bloques.set(bloques);
        this.cargandoHorario.set(false);
      },
      error: () => this.cargandoHorario.set(false)
    });
  }

  cambiarSemana(semanas: number): void {
    this.lunes.set(this.sumarSemanas(this.lunes(), semanas));
    this.elegido.set(null);
  }

  elegir(bloque: BloqueElegido): void {
    const mismo = this.claveElegida() === claveBloque(bloque.dia, bloque.hora);
    this.elegido.set(mismo ? null : bloque);
  }

  enviar(): void {
    this.intentoEnviar.set(true);
    this.form.markAllAsTouched();
    const fecha = this.fechaElegida();
    const { materiaId, tutorId, duracionMinutos, modalidad } = this.form.getRawValue();
    if (this.form.invalid || !fecha || !this.cabe() || !materiaId || !tutorId) return;

    this.enviando.set(true);
    this.error.set('');
    this.sesionService.solicitar({ materiaId, tutorId, duracionMinutos, modalidad, fechaHora: aFechaLocal(fecha) }).subscribe({
      next: (sesion) => {
        this.avisos.mostrar(this.translate.instant('RESERVAR.ENVIADA'));
        this.router.navigate(['/app/tutorias', sesion.id]);
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.enviando.set(false);
      }
    });
  }

  private sumarSemanas(fecha: Date, semanas: number): Date {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + semanas * 7);
    return nueva;
  }
}
