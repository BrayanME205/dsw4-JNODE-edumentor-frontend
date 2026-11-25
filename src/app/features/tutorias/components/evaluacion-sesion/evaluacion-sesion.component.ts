import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Evaluacion } from '../../../../core/models/evaluacion.model';
import { Sesion } from '../../../../core/models/sesion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AvisoService } from '../../../../core/services/aviso.service';
import { EvaluacionService } from '../../../../core/services/evaluacion.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { FechaPipe } from '../../../../shared/pipes/fecha.pipe';

/**
 * Evaluación de la tutoría.
 * - COMPLETED + estudiante: formulario de 1 a 5 estrellas (radios nativos, accesibles con teclado) y comentario.
 * - REVIEWED: muestra la evaluación registrada.
 */
@Component({
  selector: 'app-evaluacion-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, AlertaComponent, FechaPipe],
  templateUrl: './evaluacion-sesion.component.html',
  styleUrl: './evaluacion-sesion.component.css'
})
export class EvaluacionSesionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly evaluacionService = inject(EvaluacionService);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);

  readonly sesion = input.required<Sesion>();
  readonly evaluada = output<void>();

  readonly estrellas = [1, 2, 3, 4, 5];
  readonly evaluacion = signal<Evaluacion | null>(null);
  readonly enviando = signal(false);
  readonly error = signal('');
  /** Estrella bajo el puntero, para la vista previa al pasar el mouse. */
  readonly sobre = signal(0);

  readonly form = this.fb.group({
    calificacionEstrellas: this.fb.control<number | null>(null, Validators.required),
    comentario: this.fb.nonNullable.control('', Validators.maxLength(500))
  });
  readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  readonly marcadas = computed(() => this.sobre() || this.valores().calificacionEstrellas || 0);

  readonly puedeEvaluar = computed(() => this.sesion().estado === 'COMPLETED' && this.auth.rol() === 'ESTUDIANTE');
  readonly esperando = computed(() => this.sesion().estado === 'COMPLETED' && this.auth.rol() === 'TUTOR');

  ngOnInit(): void {
    if (this.sesion().estado === 'REVIEWED') {
      this.evaluacionService.obtener(this.sesion().id).subscribe({
        next: (e) => this.evaluacion.set(e),
        error: () => this.evaluacion.set(null)
      });
    }
  }

  enviar(): void {
    const { calificacionEstrellas, comentario } = this.form.getRawValue();
    if (this.form.invalid || !calificacionEstrellas) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    this.evaluacionService.registrar(this.sesion().id, { calificacionEstrellas, comentario: comentario.trim() }).subscribe({
      next: (e) => {
        this.evaluacion.set(e);
        this.enviando.set(false);
        this.avisos.mostrar(this.translate.instant('EVALUACION.GRACIAS'));
        this.evaluada.emit(); // el detalle recarga y la ruta llega a "Evaluada"
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.enviando.set(false);
      }
    });
  }
}
