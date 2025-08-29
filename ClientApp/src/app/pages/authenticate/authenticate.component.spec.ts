import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticateComponent, AuthStep } from './authenticate.component';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

describe('AuthenticateComponent', () => {
  let component: AuthenticateComponent;
  let fixture: ComponentFixture<AuthenticateComponent>;
  let queryParams$: Subject<object>;

  beforeEach(async () => {
    queryParams$ = new Subject();
    await TestBed.configureTestingModule({
      imports: [AuthenticateComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$ } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticateComponent);
    component = fixture.componentInstance;
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

    // Act
    component.receiveOtpRequest('test@example.com');

    // Assert
    expect(component.emailAddress()).toBe('test@example.com');
    expect(component.step as AuthStep).toBe(AuthStep.VerifyOtp);
  });

  it('should increment step and update signal when receiveSignUpRequest is called', () => {
    // Arrange
    component.step = AuthStep.Register;

    // Act
    component.receiveSignUpRequest({ email: 'test@example.com', password: 'Valid1@password' });
    
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
});
