import { Component, input } from '@angular/core';

/** Mensaje de resultado. El texto de error suele venir del "detail" del ProblemDetail del backend. */
@Component({
  selector: 'app-alerta',
  standalone: true,
  template: `
    <div [class]="'em-alert em-alert--' + tipo()" [attr.role]="tipo() === 'exito' ? 'status' : 'alert'">
      @if (titulo()) {
        <strong>{{ titulo() }}</strong>
      }
      {{ mensaje() }}
      <ng-content />
    </div>
  `
})
export class AlertaComponent {
  readonly tipo = input<'error' | 'exito' | 'aviso'>('error');
  readonly titulo = input('');
  readonly mensaje = input('');
}
