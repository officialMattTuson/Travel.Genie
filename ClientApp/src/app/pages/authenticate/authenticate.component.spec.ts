import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticateComponent, AuthStep } from './authenticate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthenticateComponent', () => {
  let component: AuthenticateComponent;
  let fixture: ComponentFixture<AuthenticateComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let queryParams$: Subject<object>;

  beforeEach(async () => {
    queryParams$ = new Subject();
    authServiceSpy = jasmine.createSpyObj('AuthService', ['sendOtpRequest', 'verifyOtp', 'register', 'login']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['displaySuccess', 'displayError']);
    await TestBed.configureTestingModule({
      imports: [AuthenticateComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$ } },
        { provide: AlertService, useValue: alertServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticateComponent);
    component = fixture.componentInstance;
    component.emailAddress = signal('test@example.com');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with step RequestOtp', () => {
    expect(component.step).toBe(component.AuthStep.RequestOtp);
  });

  it('should set step to Login if query param step=login', () => {
    queryParams$.next({ step: 'login' });
    expect(component.step).toBe(AuthStep.Login);
  });

  it('should increment step when next() is called', () => {
    // Arrange
    component.step = AuthStep.RequestOtp;

    // Act
    component.next();

    // Assert
    expect(component.step as AuthStep).toBe(AuthStep.VerifyOtp);
  });

  it('should increment step and update signal when receiveOtpRequest is called', () => {
    // Arrange
    component.step = AuthStep.RequestOtp;
    authServiceSpy.sendOtpRequest.and.returnValue(of({ message: 'OTP verified successfully' }));

    // Act
    component.receiveOtpRequest('test@example.com');

    // Assert
    expect(component.emailAddress()).toBe('test@example.com');
    expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('A One Time Password has been sent to your email inbox.');
    expect(component.step as AuthStep).toBe(AuthStep.VerifyOtp);
  });

  it('should increment step and update signal when receiveSignUpRequest is called', () => {
    // Arrange
    component.step = AuthStep.Register;
    authServiceSpy.register.and.returnValue(of({ token: 'test', message: 'User registered successfully' }));

    // Act
    component.receiveSignUpRequest({
      email: 'test@example.com',
      password: 'Valid1@password',
    });

    // Assert
    expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('Registration successful! You can now log in.');
    expect(component.step as AuthStep).toBe(AuthStep.Login);
  });

  it('should increment step and update signal when receiveOtpVerification is called', () => {
    // Arrange
    component.step = AuthStep.Register;
    authServiceSpy.verifyOtp.and.returnValue(of({ message: 'OTP verified successfully' }));
    // Act
    component.receiveOtpVerification('123456');

    // Assert
    expect(component.step as AuthStep).toBe(AuthStep.Login);
  });

  it('should not increment step beyond Login', () => {
    // Arrange
    component.step = AuthStep.Login;

    // Act
    component.next();

    // Assert
    expect(component.step).toBe(AuthStep.Login);
  });

  it('should navigate to dashboard when receiveLoginRequest is called', () => {
    // Arrange
    const spy = spyOn(component, 'navigateToDashboard');
    authServiceSpy.login.and.returnValue(of({ token: 'test', message: 'User logged in successfully' }));

    // Act
    component.receiveLoginRequest({
      email: 'test@example.com',
      password: 'Valid1@password',
    });

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to dashboard when navigateToDashboard is called', () => {
    // Arrange
    const spy = spyOn(TestBed.inject(Router), 'navigate');

    // Act
    component.navigateToDashboard();

    // Assert
    expect(spy).toHaveBeenCalledWith(['/dashboard']);
  });

  describe('Error Handling', () => {
    it('should call alertService.displayError on OTP request failure', () => {
      // Arrange
      const errorResponse = { error: { message: 'Failed to send OTP' } } as HttpErrorResponse;
      authServiceSpy.sendOtpRequest.and.returnValue(throwError(() => errorResponse));
      // Act
      component.receiveOtpRequest('test@example.com');

      // Assert
      expect(alertServiceSpy.displayError).toHaveBeenCalledWith(errorResponse.error.message);
    });

    it('should call alertService.displayError on OTP verification failure', () => {
      // Arrange
      const errorResponse = { error: { message: 'Failed to verify OTP' } } as HttpErrorResponse;
      authServiceSpy.verifyOtp.and.returnValue(throwError(() => errorResponse));
      // Act
      component.receiveOtpVerification('123456');

      // Assert
      expect(alertServiceSpy.displayError).toHaveBeenCalledWith(errorResponse.error.message);
    });

    it('should call alertService.displayError on sign-up failure', () => {
      // Arrange
      const errorResponse = { error: { message: 'Failed to sign up' } } as HttpErrorResponse;
      authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

      // Act
      component.receiveSignUpRequest({
        email: 'test@example.com',
        password: 'Valid1@password',
      });

      // Assert
      expect(alertServiceSpy.displayError).toHaveBeenCalledWith(errorResponse.error.message);
    });

    it('should call alertService.displayError on login failure', () => {
      // Arrange
      const errorResponse = { error: { message: 'Failed to log in' } } as HttpErrorResponse;
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      // Act
      component.receiveLoginRequest({
        email: 'test@example.com',
        password: 'Valid1@password',
      });

      // Assert
      expect(alertServiceSpy.displayError).toHaveBeenCalledWith(errorResponse.error.message);
    });
  });
});
