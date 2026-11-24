import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Materia } from '../../../../core/models/materia.model';
import { AvisoService } from '../../../../core/services/aviso.service';
import { MateriaService } from '../../../../core/services/materia.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { ConfirmarDialogoComponent } from '../../../../shared/components/confirmar-dialogo/confirmar-dialogo.component';
import { EncabezadoPaginaComponent } from '../../../../shared/components/encabezado-pagina/encabezado-pagina.component';

type Campo = 'codigoMateria' | 'nombreMateria' | 'carrera' | 'creditos';

/** Administración del catálogo (solo COORDINADOR): tabla + formulario para crear o editar. */
@Component({
  selector: 'app-materias-admin',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, EncabezadoPaginaComponent, CargandoComponent, AlertaComponent, ConfirmarDialogoComponent],
  templateUrl: './materias-admin.component.html',
  styleUrl: './materias-admin.component.css'
})
export class MateriasAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly materiaService = inject(MateriaService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);

  readonly materias = signal<Materia[]>([]);
  readonly cargando = signal(true);
  readonly errorLista = signal('');
  readonly busqueda = signal('');

  /** null = creando una materia nueva; con valor = editando esa materia. */
  readonly editando = signal<Materia | null>(null);
  readonly guardando = signal(false);
  readonly errorForm = signal('');
  readonly porEliminar = signal<Materia | null>(null);

  readonly filtradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    return this.materias().filter((m) => !texto || `${m.codigoMateria} ${m.nombreMateria}`.toLowerCase().includes(texto));
  });

  readonly form = this.fb.nonNullable.group({
    codigoMateria: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,4}[0-9]{3,4}$/)]],
    nombreMateria: ['', [Validators.required, Validators.maxLength(150)]],
    carrera: ['', [Validators.required, Validators.maxLength(100)]],
    creditos: [4, [Validators.required, Validators.min(1), Validators.max(10)]]
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.errorLista.set('');
    this.materiaService.listar().subscribe({
      next: (lista) => {
        this.materias.set(lista);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.errorLista.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
  }

  buscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }

  editar(materia: Materia): void {
    this.editando.set(materia);
    this.errorForm.set('');
    this.form.setValue({
      codigoMateria: materia.codigoMateria,
      nombreMateria: materia.nombreMateria,
      carrera: materia.carrera,
      creditos: materia.creditos
    });
  }

  nueva(): void {
    this.editando.set(null);
    this.errorForm.set('');
    this.form.reset();
  }

  invalido(campo: Campo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  mensaje(campo: Campo): string {
    const errores = this.form.controls[campo].errors ?? {};
    if (errores['required']) return 'COMUN.OBLIGATORIO';
    if (errores['pattern']) return 'MATERIAS.CODIGO_FORMATO';
    if (errores['min'] || errores['max']) return 'MATERIAS.CREDITOS_RANGO';
    return 'AUTH.DEMASIADO_LARGO';
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
    const peticion = actual ? this.materiaService.actualizar(actual.id, datos) : this.materiaService.crear(datos);
    peticion.subscribe({
      next: () => {
        this.avisos.mostrar(this.translate.instant(actual ? 'MATERIAS.ACTUALIZADA' : 'MATERIAS.CREADA'));
        this.guardando.set(false);
        this.nueva();
        this.cargar();
      },
      error: (err: unknown) => {
        this.errorForm.set(mensajeDeError(err));
        this.guardando.set(false);
      }
    });
  }

  confirmarEliminacion(): void {
    const materia = this.porEliminar();
    this.porEliminar.set(null);
    if (!materia) {
      return;
    }
    this.materiaService.eliminar(materia.id).subscribe({
      next: () => {
        this.avisos.mostrar(this.translate.instant('MATERIAS.ELIMINADA'));
        if (this.editando()?.id === materia.id) {
          this.nueva();
        }
        this.cargar();
      },
      // 409: la materia ya tiene sesiones registradas
      error: (err: unknown) => this.avisos.mostrar(this.translate.instant(mensajeDeError(err)), 'error')
    });
  }
}
