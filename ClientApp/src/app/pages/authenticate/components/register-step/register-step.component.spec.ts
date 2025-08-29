import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterStepComponent } from './register-step.component';
import { signal } from '@angular/core';

describe('RegisterStepComponent', () => {
  let component: RegisterStepComponent;
  let fixture: ComponentFixture<RegisterStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterStepComponent);
    component = fixture.componentInstance;
    component.emailAddress = signal('test@example.com');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set email value from emailAddress signal and disable email control', () => {
    const emailControl = component.registrationForm.get('email');
    expect(emailControl?.value).toBe('test@example.com');
    expect(emailControl?.disabled).toBeTrue();
  });

  it('should not emit onRegister if form is invalid', () => {
    // Arrange
    spyOn(component.registrationRequest, 'emit');
    component.registrationForm.get('password')?.setValue('short');

    // Act
    component.signUp();

    // Assert
    expect(component.registrationRequest.emit).not.toHaveBeenCalled();
  });

  it('should emit onRegister with correct details if form is valid', () => {
    // Arrange
    spyOn(component.registrationRequest, 'emit');
    component.registrationForm.get('password')?.setValue('Valid1@password');

    // Act
    component.signUp();

    // Assert
    expect(component.registrationRequest.emit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Valid1@password',
    });
  });

  it('should set submissionAttempted to true after signUp', () => {
    // Arrange
    component.registrationForm.get('password')?.setValue('Valid1@password');

    // Act
    component.signUp();

    // Assert
    expect(component.submissionAttempted).toBeTrue();
  });
});
