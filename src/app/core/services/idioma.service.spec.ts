import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IdiomaService } from './idioma.service';

describe('IdiomaService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
  });

  it('empieza en español si no hay nada guardado', () => {
    expect(TestBed.inject(IdiomaService).actual()).toBe('es');
  });

  it('al cambiar, guarda el idioma, usa sus textos y actualiza <html lang>', () => {
    const servicio = TestBed.inject(IdiomaService);
    servicio.cambiar('en');
    expect(servicio.actual()).toBe('en');
    expect(localStorage.getItem('edumentor_idioma')).toBe('en');
    expect(TestBed.inject(TranslateService).currentLang).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});
