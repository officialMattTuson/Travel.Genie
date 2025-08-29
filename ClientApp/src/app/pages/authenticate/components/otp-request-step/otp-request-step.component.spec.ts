import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpRequestStepComponent } from './otp-request-step.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { Router } from '@angular/router';

describe('OtpRequestStepComponent', () => {
  let component: OtpRequestStepComponent;
  let fixture: ComponentFixture<OtpRequestStepComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpRequestStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpRequestStepComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buttons', () => {
    it('should emit otpRequested event when send button is clicked', async () => {
      // Arrange
      const spy = spyOn(component, 'sendVerificationEmail');
      const button = await loader.getHarness(
        MatButtonHarness.with({ selector: '.send' })
      );

      // Act
      await button.click();

      // Assert
      expect(spy).toHaveBeenCalled();
    });

    it('should call returnHome when clicked', async () => {
      // Arrange
      const spy = spyOn(component, 'returnHome');
      const button = await loader.getHarness(
        MatButtonHarness.with({ selector: '.return' })
      );

      // Act
      await button.click();

      // Assert
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('form', () => {
    it('should initialize form with empty email', () => {
      expect(component.emailForm.value).toEqual({ email: '' });
    });

    it('should have a valid form when email is provided', () => {
      component.emailForm.setValue({ email: 'test@example.com' });
      expect(component.emailForm.valid).toBeTruthy();
    });

    it('should have an invalid form when email is not provided', () => {
      component.emailForm.setValue({ email: '' });
      expect(component.emailForm.valid).toBeFalsy();
    });

    it('should have an invalid form when invalid email is provided', () => {
      component.emailForm.setValue({ email: 'invalid-email' });
      expect(component.emailForm.valid).toBeFalsy();
    });

    it('should emit otpRequested event with email on valid form submission', () => {
      // Arrange
      spyOn(component.otpRequested, 'emit');
      component.emailForm.setValue({ email: 'test@example.com' });

      // Act
      component.sendVerificationEmail();

      // Assert
      expect(component.otpRequested.emit).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should not emit otpRequested event on invalid form submission', () => {
      // Arrange
      spyOn(component.otpRequested, 'emit');
      component.emailForm.setValue({ email: 'invalid-email' });

      // Act
      component.sendVerificationEmail();

      // Assert
      expect(component.otpRequested.emit).not.toHaveBeenCalled();
    });
  });

  describe('returnHome', () => {
    it('should emit returnHome event when called', () => {
      // Arrange
      const spy = spyOn(TestBed.inject(Router), 'navigate');

      // Act
      component.returnHome();

      // Assert
      expect(spy).toHaveBeenCalledWith(['home']);
    });
  });
});
