import { Component, input } from '@angular/core';

import { InicialesPipe } from '../../pipes/iniciales.pipe';

/** Círculo con iniciales. Es decorativo: el nombre siempre se muestra en texto al lado. */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [InicialesPipe],
  template: `<span class="em-avatar" [class.em-avatar--lg]="grande()" aria-hidden="true">{{ nombre() | iniciales }}</span>`
})
export class AvatarComponent {
  readonly nombre = input.required<string>();
  readonly grande = input(false);
}
