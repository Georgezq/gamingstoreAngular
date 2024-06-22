import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authVerifiedGuard } from './auth-verified.guard';

describe('authVerifiedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authVerifiedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
