import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Diálogo de confirmación con el elemento nativo <dialog>: atrapa el foco y se cierra con Esc.
 * Uso: <app-confirmar-dialogo [abierto]="..." titulo="..." (confirmado)="..." (cancelado)="..." />
 */
@Component({
  selector: 'app-confirmar-dialogo',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <dialog #dialogo class="dialogo" aria-labelledby="dialogo-titulo" (close)="alCerrar()">
      <h2 id="dialogo-titulo" class="dialogo__titulo">{{ titulo() }}</h2>
      <p class="em-muted">{{ mensaje() }}</p>
      <ng-content />
      <div class="em-cluster dialogo__acciones">
        <button type="button" class="em-btn em-btn--ghost" (click)="cancelar()">{{ 'COMUN.VOLVER' | translate }}</button>
        <button type="button" class="em-btn" [class.em-btn--danger]="peligro()" [class.em-btn--primary]="!peligro()" (click)="confirmar()">
          {{ textoConfirmar() }}
        </button>
      </div>
    </dialog>
  `,
  styles: `
    .dialogo { max-width: 28rem; width: calc(100% - 2rem); border: 0; border-radius: 24px; padding: var(--em-space-6);
      box-shadow: var(--em-shadow-pop); color: var(--em-text); }
    .dialogo::backdrop { background: rgba(13, 10, 31, .55); }
    .dialogo__titulo { font-size: var(--em-text-lg); }
    .dialogo__acciones { justify-content: flex-end; margin-top: var(--em-space-5); }
  `
})
export class ConfirmarDialogoComponent {
  readonly abierto = input(false);
  readonly titulo = input.required<string>();
  readonly mensaje = input('');
  readonly textoConfirmar = input.required<string>();
  readonly peligro = input(true);

  readonly confirmado = output<void>();
  readonly cancelado = output<void>();

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private confirmando = false;

  constructor() {
    // Abre o cierra el <dialog> nativo cuando cambia la entrada "abierto"
    effect(() => {
      const elemento = this.dialogo().nativeElement;
      if (this.abierto() && !elemento.open) {
        elemento.showModal();
      } else if (!this.abierto() && elemento.open) {
        elemento.close();
      }
    });
  }

  confirmar(): void {
    this.confirmando = true;
    this.dialogo().nativeElement.close();
    this.confirmado.emit();
  }

  cancelar(): void {
    this.dialogo().nativeElement.close();
  }

  /** Se ejecuta al cerrar por cualquier vía (botón Volver o tecla Esc). */
  alCerrar(): void {
    if (!this.confirmando) {
      this.cancelado.emit();
    }
    this.confirmando = false;
  }
}
