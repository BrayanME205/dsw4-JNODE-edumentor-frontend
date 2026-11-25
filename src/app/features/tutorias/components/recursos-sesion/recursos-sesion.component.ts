import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Recurso } from '../../../../core/models/recurso.model';
import { Sesion } from '../../../../core/models/sesion.model';
import { AvisoService } from '../../../../core/services/aviso.service';
import { RecursoService } from '../../../../core/services/recurso.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';

/** Material de estudio de la tutoría: lista de enlaces y formulario para agregar uno. */
@Component({
  selector: 'app-recursos-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, AlertaComponent],
  templateUrl: './recursos-sesion.component.html',
  styleUrl: './recursos-sesion.component.css'
})
export class RecursosSesionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recursoService = inject(RecursoService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);

  readonly sesion = input.required<Sesion>();
  readonly tipos = ['ENLACE', 'PDF', 'VIDEO', 'DOCUMENTO', 'PRESENTACION', 'OTRO'];

  readonly recursos = signal<Recurso[]>([]);
  readonly error = signal('');
  readonly abierto = signal(false);
  readonly guardando = signal(false);
  readonly errorForm = signal('');

  /** Igual que en el backend: se agregan recursos desde que se confirma la tutoría. */
  readonly puedeAgregar = computed(() => ['CONFIRMED', 'IN_SESSION', 'COMPLETED', 'REVIEWED'].includes(this.sesion().estado));

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    urlRecurso: ['', [Validators.required, Validators.maxLength(500), Validators.pattern(/^https?:\/\/\S+$/)]],
    tipoArchivo: ['ENLACE']
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.recursoService.listar(this.sesion().id).subscribe({
      next: (lista) => this.recursos.set(lista),
      error: (err: unknown) => this.error.set(mensajeDeError(err))
    });
  }

  invalido(campo: 'titulo' | 'urlRecurso'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  /** Muestra el tipo traducido si es uno de los nuestros; si no, el texto tal cual. */
  etiquetaTipo(tipo: string | null): string {
    if (!tipo) return '';
    const clave = `RECURSOS.TIPO_${tipo.toUpperCase()}`;
    const traducido = this.translate.instant(clave);
    return traducido === clave ? tipo : traducido;
  }

  agregar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.errorForm.set('');
    this.recursoService.agregar(this.sesion().id, this.form.getRawValue()).subscribe({
      next: (nuevo) => {
        this.recursos.update((lista) => [...lista, nuevo]);
        this.avisos.mostrar(this.translate.instant('RECURSOS.AGREGADO'));
        this.form.reset();
        this.abierto.set(false);
        this.guardando.set(false);
      },
      error: (err: unknown) => {
        this.errorForm.set(mensajeDeError(err));
        this.guardando.set(false);
      }
    });
  }
}
