import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticateComponent, AuthStep } from './authenticate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

describe('AuthenticateComponent', () => {
  let component: AuthenticateComponent;
  let fixture: ComponentFixture<AuthenticateComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let queryParams$: Subject<object>;

  beforeEach(async () => {
    queryParams$ = new Subject();
    authServiceSpy = jasmine.createSpyObj('AuthService', ['sendOtpRequest', 'verifyOtp', 'register', 'login']);
    await TestBed.configureTestingModule({
      imports: [AuthenticateComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$ } },
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
    authServiceSpy.sendOtpRequest.and.returnValue(of({message: "OTP verified successfully"}));

    // Act
    component.receiveOtpRequest('test@example.com');

    // Assert
    expect(component.emailAddress()).toBe('test@example.com');
    expect(component.step as AuthStep).toBe(AuthStep.VerifyOtp);
  });

  it('should increment step and update signal when receiveSignUpRequest is called', () => {
    // Arrange
    component.step = AuthStep.Register;
    authServiceSpy.register.and.returnValue(of({token: 'test', message: "User registered successfully"}));

    // Act
    component.receiveSignUpRequest({
      email: 'test@example.com',
      password: 'Valid1@password',
    });

    // Assert
    expect(component.step as AuthStep).toBe(AuthStep.Login);
  });

  it('should increment step and update signal when receiveOtpVerification is called', () => {
    // Arrange
    component.step = AuthStep.Register;
    authServiceSpy.verifyOtp.and.returnValue(of({message: "OTP verified successfully"}));
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
    authServiceSpy.login.and.returnValue(of({token: 'test', message: "User logged in successfully"}));

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
});
