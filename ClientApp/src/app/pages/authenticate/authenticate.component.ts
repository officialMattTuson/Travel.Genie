import { Component, inject, signal } from '@angular/core';
import { RegisterStepComponent } from './components/register-step/register-step.component';
import { OtpRequestStepComponent } from './components/otp-request-step/otp-request-step.component';
import { LoginStepComponent } from './components/login-step/login-step.component';
import { OtpVerifyStepComponent } from './components/otp-verify-step/otp-verify-step.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationDetails } from './Models/registration-details.model';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../services/alert.service';

export enum AuthStep {
  RequestOtp,
  VerifyOtp,
  Register,
  Login,
}

@Component({
  selector: 'app-authenticate',
  imports: [
    RegisterStepComponent,
    OtpRequestStepComponent,
    OtpVerifyStepComponent,
    LoginStepComponent,
    CommonModule,
  ],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss',
})
export class AuthenticateComponent {
  step = AuthStep.RequestOtp;
  AuthStep = AuthStep;
  emailAddress = signal('');

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['step'] === 'login') {
        this.step = AuthStep.Login;
      }
    });
  }

  receiveOtpRequest(email: string) {
    console.log('Received OTP request for email:', email);
    this.authService
      .sendOtpRequest(email)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.emailAddress.set(email);
          this.alertService.displaySuccess('A One Time Password has been sent to your email inbox.');
          this.step = AuthStep.VerifyOtp;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.alertService.displayError(errorResponse.error.message);
        },
      });
  }

  receiveOtpVerification(otp: string) {
    this.authService
      .verifyOtp(this.emailAddress(), otp)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.next();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.alertService.displayError(errorResponse.error.message);
        },
      });
  }

  receiveSignUpRequest(registrationDetails: RegistrationDetails) {
    this.authService
      .register(registrationDetails)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alertService.displaySuccess('Registration successful! You can now log in.');
          this.next();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.alertService.displayError(errorResponse.error.message);
        },
      });
  }

  receiveLoginRequest(loginDetails: RegistrationDetails) {
    this.authService
      .login(loginDetails)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.navigateToDashboard();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.alertService.displayError(errorResponse.error.message);
        },
      });
  }

  next() {
    if (this.step < AuthStep.Login) {
      this.step++;
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
