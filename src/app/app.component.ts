import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AvisosComponent } from './shared/components/avisos/avisos.component';

/** Raíz: solo el router y la zona de avisos. Cada layout pinta su propia estructura. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AvisosComponent],
  template: `<router-outlet /><app-avisos />`
})
export class AppComponent {}
