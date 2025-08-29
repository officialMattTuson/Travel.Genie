import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginStepComponent } from './login-step.component';
import { signal, Signal } from '@angular/core';
import { RegistrationDetails } from '../../Models/registration-details.model';

describe('LoginStepComponent', () => {
  let component: LoginStepComponent;
  let fixture: ComponentFixture<LoginStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginStepComponent);
    component = fixture.componentInstance;
    component.emailAddress = signal('test@example.com');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set email from emailAddress Signal on construction', () => {
    expect(component.registrationForm.get('email')?.value).toBe(
      'test@example.com'
    );
  });

  it('should mark form as touched and not emit if form is invalid', () => {
    spyOn(component.loginRequest, 'emit');
    component.registrationForm.get('email')?.setValue('');
    component.registrationForm.get('password')?.setValue('');
    component.signIn();
    expect(component.submissionAttempted).toBeTrue();
    expect(component.loginRequest.emit).not.toHaveBeenCalled();
    expect(component.registrationForm.get('email')?.touched).toBeTrue();
    expect(component.registrationForm.get('password')?.touched).toBeTrue();
  });

  it('should emit loginRequest with form value if form is valid', () => {
    spyOn(component.loginRequest, 'emit');
    const details: RegistrationDetails = {
      email: 'valid@example.com',
      password: 'password123',
    } as RegistrationDetails;
    component.registrationForm.get('email')?.setValue(details.email);
    component.registrationForm.get('password')?.setValue(details.password);
    component.signIn();
    expect(component.loginRequest.emit).toHaveBeenCalledWith(details);
  });

  it('should set submissionAttempted to true after signIn', () => {
    component.signIn();
    expect(component.submissionAttempted).toBeTrue();
  });
});
