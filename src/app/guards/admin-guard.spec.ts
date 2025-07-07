import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGardGuard } from './admin-guard';

describe('adminGardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => adminGardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
