import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/** Marca (imagen) + nombre en texto, para que lo lean los lectores de pantalla y se traduzca. */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <a class="logo" [routerLink]="destino()" [attr.aria-label]="'MARCA.IR_AL_INICIO' | translate">
      <img src="assets/img/logo-marca.png" alt="" width="40" height="38">
      <span class="logo__texto" [class.logo__texto--oscuro]="oscuro()">
        <span>EduMentor</span><span class="logo__hub">Hub</span>
      </span>
    </a>
  `,
  styles: `
    .logo { display: inline-flex; align-items: center; gap: .625rem; text-decoration: none; }
    .logo img { width: 40px; height: auto; }
    .logo__texto { display: flex; flex-direction: column; line-height: 1; font-weight: 800; font-size: 1.0625rem; color: var(--em-text); }
    .logo__hub { color: #6B2FB3; }
    .logo__texto--oscuro { color: #fff; }
    .logo__texto--oscuro .logo__hub { color: var(--em-pink-pale); }
  `
})
export class LogoComponent {
  readonly oscuro = input(false);
  readonly destino = input('/');
}
