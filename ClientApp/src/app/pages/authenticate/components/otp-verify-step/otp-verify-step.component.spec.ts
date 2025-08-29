import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerifyStepComponent } from './otp-verify-step.component';
import { signal } from '@angular/core';

describe('OtpVerifyStepComponent', () => {
  let component: OtpVerifyStepComponent;
  let fixture: ComponentFixture<OtpVerifyStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerifyStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerifyStepComponent);
    component = fixture.componentInstance;
    component.emailAddress = signal('test@example.com');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display email address in DOM', () => {
    const emailElement = fixture.nativeElement.querySelector('mat-card-subtitle b');
    expect(emailElement.textContent).toContain('test@example.com');
  });

  it('should have otpRequestForm with otp control', () => {
    expect(component.otpRequestForm.contains('otp')).toBeTrue();
  });

  it('should mark otp as invalid if empty', () => {
    component.otpRequestForm.get('otp')?.setValue('');
    expect(component.otpRequestForm.get('otp')?.valid).toBeFalse();
  });

  it('should mark otp as invalid if not 6 digits', () => {
    component.otpRequestForm.get('otp')?.setValue('12345');
    expect(component.otpRequestForm.get('otp')?.valid).toBeFalse();
  });

  it('should mark otp as valid if 6 digits', () => {
    component.otpRequestForm.get('otp')?.setValue('123456');
    expect(component.otpRequestForm.get('otp')?.valid).toBeTrue();
  });

  it('should not emit otpVerified if form is invalid', () => {
    spyOn(component.otpVerified, 'emit');
    component.otpRequestForm.get('otp')?.setValue('');
    component.verifyOtpRequest();
    expect(component.otpVerified.emit).not.toHaveBeenCalled();
  });

  it('should emit otpVerified if form is valid', () => {
    spyOn(component.otpVerified, 'emit');
    component.otpRequestForm.get('otp')?.setValue('123456');
    component.verifyOtpRequest();
    expect(component.otpVerified.emit).toHaveBeenCalled();
  });
});
