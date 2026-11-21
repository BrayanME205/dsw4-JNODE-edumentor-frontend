import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/** Página de inicio pública. Las secciones con datos de la API se agregan en REQ-15 y REQ-16. */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  /** Los cuatro pasos del recorrido de una tutoría (claves de traducción). */
  readonly pasos = ['SOLICITA', 'CONFIRMA', 'SESION', 'EVALUA'];
}
