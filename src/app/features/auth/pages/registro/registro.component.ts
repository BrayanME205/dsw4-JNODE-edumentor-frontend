import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

import { RolRegistro } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AvisoService } from '../../../../core/services/aviso.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { MarcoAuthComponent } from '../../components/marco-auth/marco-auth.component';

type Campo = 'nombre' | 'apellido' | 'carne' | 'email' | 'password';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, MarcoAuthComponent, AlertaComponent],
  templateUrl: './registro.component.html',
  styles: `
    .roles { display: flex; flex-wrap: wrap; gap: var(--em-space-3); border: 0; margin: 0; padding: 0; }
    .roles legend { font-weight: 600; font-size: var(--em-text-xs); margin-bottom: var(--em-space-2); }
    .rol { flex: 1 1 11rem; display: flex; gap: var(--em-space-3); align-items: flex-start; padding: var(--em-space-4);
      border: 1.5px solid var(--em-border-control); border-radius: 14px; background: var(--em-surface); cursor: pointer; }
    .rol:has(input:checked) { border-color: var(--em-primary); background: var(--em-lavender); }
    .rol input { margin-top: 3px; width: 18px; height: 18px; accent-color: var(--em-primary); }
    .rol strong { display: block; }
    .dos { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr)); gap: var(--em-space-4); }
  `
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    rol: [(this.route.snapshot.queryParamMap.get('rol') === 'TUTOR' ? 'TUTOR' : 'ESTUDIANTE') as RolRegistro],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    carne: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]]
  });

  readonly enviando = signal(false);
  readonly error = signal('');

  invalido(campo: Campo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  /** Clave de traducción del primer error del campo. */
  mensaje(campo: Campo): string {
    const errores = this.form.controls[campo].errors ?? {};
    if (errores['required']) return 'COMUN.OBLIGATORIO';
    if (errores['email']) return 'AUTH.CORREO_INVALIDO';
    if (errores['minlength']) return 'AUTH.CONTRASENA_CORTA';
    return 'AUTH.DEMASIADO_LARGO';
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue();
    // Crea la cuenta y luego inicia sesión con las mismas credenciales
    this.auth.registrar(datos).pipe(
      switchMap(() => this.auth.login({ email: datos.email, password: datos.password }))
    ).subscribe({
      next: () => {
        this.avisos.mostrar(this.translate.instant('AUTH.CUENTA_CREADA'));
        this.router.navigateByUrl(this.auth.rutaInicio());
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.enviando.set(false);
      }
    });
  }
}
