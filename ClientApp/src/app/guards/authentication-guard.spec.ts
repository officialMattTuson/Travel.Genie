// File: src/app/guards/authentication.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  GuardResult,
  provideRouter,
} from '@angular/router';
import { of, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthenticationGuard } from './authentication-guard';
import { Injector, runInInjectionContext } from '@angular/core';

describe('AuthenticationGuard (functional CanActivateFn)', () => {
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/is-authenticated' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
      ],
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should allow access when authenticated', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(of(true));

    const injector = TestBed.inject(Injector);
    runInInjectionContext(injector, () => {
      const result$ = AuthenticationGuard(route, state);
      (result$ as Observable<GuardResult>).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  it('should block access when not authenticated', (done) => {
    authServiceSpy.isAuthenticated.and.returnValue(of(false));
    const injector = TestBed.inject(Injector);
    runInInjectionContext(injector, () => {
      const result$ = AuthenticationGuard(route, state);
      (result$ as Observable<GuardResult>).subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });
  });
});
