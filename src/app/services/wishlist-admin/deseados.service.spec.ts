import { TestBed } from '@angular/core/testing';

import { DeseadosService } from './deseados.service';

describe('DeseadosService', () => {
  let service: DeseadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeseadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
