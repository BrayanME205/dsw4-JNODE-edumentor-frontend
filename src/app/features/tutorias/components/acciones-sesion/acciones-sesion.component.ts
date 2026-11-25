import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Sesion } from '../../../../core/models/sesion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AvisoService } from '../../../../core/services/aviso.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AccionSesion, accionesDisponibles } from '../../../../core/utils/sesion-reglas';
import { ConfirmarDialogoComponent } from '../../../../shared/components/confirmar-dialogo/confirmar-dialogo.component';

/**
 * Botones de acción de una tutoría según el rol y el estado.
 * Rechazar y cancelar piden confirmación. Al terminar emite (cambio) para que la pantalla recargue.
 */
@Component({
  selector: 'app-acciones-sesion',
  standalone: true,
  imports: [RouterLink, TranslateModule, ConfirmarDialogoComponent],
  template: `
    @if (acciones().length) {
      <div class="em-cluster acciones">
        @for (accion of acciones(); track accion) {
          @switch (accion) {
            @case ('aceptar') {
              <button type="button" class="em-btn em-btn--primary em-btn--sm" [disabled]="ocupado()" (click)="ejecutar('aceptar')">{{ 'ACCIONES.ACEPTAR' | translate }}</button>
            }
            @case ('iniciar') {
              <button type="button" class="em-btn em-btn--primary em-btn--sm" [disabled]="ocupado()" (click)="ejecutar('iniciar')">{{ 'ACCIONES.INICIAR' | translate }}</button>
            }
            @case ('rechazar') {
              <button type="button" class="em-btn em-btn--secondary em-btn--sm" [disabled]="ocupado()" (click)="porConfirmar.set('rechazar')">{{ 'ACCIONES.RECHAZAR' | translate }}</button>
            }
            @case ('cancelar') {
              <button type="button" class="em-btn em-btn--danger em-btn--sm" [disabled]="ocupado()" (click)="porConfirmar.set('cancelar')">{{ 'ACCIONES.CANCELAR' | translate }}</button>
            }
            @case ('finalizar') {
              <a class="em-btn em-btn--primary em-btn--sm" [routerLink]="['/app/tutorias', sesion().id]" fragment="finalizar">{{ 'ACCIONES.FINALIZAR' | translate }}</a>
            }
            @case ('evaluar') {
              <a class="em-btn em-btn--primary em-btn--sm" [routerLink]="['/app/tutorias', sesion().id]" fragment="evaluar">{{ 'ACCIONES.EVALUAR' | translate }}</a>
            }
          }
        }
      </div>
    }

    <app-confirmar-dialogo
      [abierto]="porConfirmar() !== null"
      [titulo]="(porConfirmar() === 'rechazar' ? 'ACCIONES.RECHAZAR_TITULO' : 'ACCIONES.CANCELAR_TITULO') | translate"
      [mensaje]="(porConfirmar() === 'rechazar' ? 'ACCIONES.RECHAZAR_TEXTO' : 'ACCIONES.CANCELAR_TEXTO') | translate"
      [textoConfirmar]="(porConfirmar() === 'rechazar' ? 'ACCIONES.RECHAZAR' : 'ACCIONES.CANCELAR_CONFIRMAR') | translate"
      (confirmado)="confirmar()"
      (cancelado)="porConfirmar.set(null)" />
  `,
  styles: `.acciones { gap: var(--em-space-2); }`
})
export class AccionesSesionComponent {
  private readonly sesionService = inject(SesionService);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisoService);
  private readonly translate = inject(TranslateService);

  readonly sesion = input.required<Sesion>();
  /** En el detalle el formulario de finalizar y el de evaluar ya están en la página. */
  readonly enDetalle = input(false);
  readonly cambio = output<void>();

  readonly ocupado = signal(false);
  readonly porConfirmar = signal<'rechazar' | 'cancelar' | null>(null);

  readonly acciones = computed(() => {
    const todas = accionesDisponibles(this.sesion(), this.auth.rol());
    return this.enDetalle() ? todas.filter((a) => a !== 'finalizar' && a !== 'evaluar') : todas;
  });

  confirmar(): void {
    const accion = this.porConfirmar();
    this.porConfirmar.set(null);
    if (accion) this.ejecutar(accion);
  }

  ejecutar(accion: AccionSesion): void {
    const id = this.sesion().id;
    const peticiones: Partial<Record<AccionSesion, () => Observable<Sesion>>> = {
      aceptar: () => this.sesionService.aceptar(id),
      rechazar: () => this.sesionService.rechazar(id),
      cancelar: () => this.sesionService.cancelar(id),
      iniciar: () => this.sesionService.iniciar(id)
    };
    const peticion = peticiones[accion];
    if (!peticion) return;

    this.ocupado.set(true);
    peticion().subscribe({
      next: () => {
        this.avisos.mostrar(this.translate.instant(`ACCIONES.HECHO_${accion.toUpperCase()}`));
        this.ocupado.set(false);
        this.cambio.emit();
      },
      error: (err: unknown) => {
        // Ej.: 409 al aceptar (la sesión se cruza y el backend la rechaza) o 422 al cancelar tarde
        this.avisos.mostrar(this.translate.instant(mensajeDeError(err)), 'error');
        this.ocupado.set(false);
        this.cambio.emit();
      }
    });
  }
}
