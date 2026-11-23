import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../../core/services/auth.service';
import { EncabezadoPaginaComponent } from '../../../../shared/components/encabezado-pagina/encabezado-pagina.component';

/**
 * Inicio provisional de cada rol mientras se integran sus pantallas reales
 * (REQ-15 coordinación, REQ-17 estudiante y tutor). Se elimina en REQ-17.
 */
@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [TranslateModule, EncabezadoPaginaComponent],
  template: `
    <app-encabezado-pagina
      [titulo]="'BIENVENIDA.HOLA' | translate: { nombre: usuario()?.nombre }"
      [subtitulo]="'BIENVENIDA.TEXTO' | translate" />
  `
})
export class BienvenidaComponent {
  readonly usuario = inject(AuthService).usuario;
}
