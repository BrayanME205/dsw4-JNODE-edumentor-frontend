import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MateriasDestacadasComponent } from '../../../materias/components/materias-destacadas/materias-destacadas.component';

/** Página de inicio pública. Incluye las materias destacadas (REQ-15); los tutores destacados llegan en REQ-16. */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, TranslateModule, MateriasDestacadasComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  /** Los cuatro pasos del recorrido de una tutoría (claves de traducción). */
  readonly pasos = ['SOLICITA', 'CONFIRMA', 'SESION', 'EVALUA'];
}
