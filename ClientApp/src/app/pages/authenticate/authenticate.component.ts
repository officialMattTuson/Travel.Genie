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
    this.authService
      .sendOtpRequest(email)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.emailAddress.set(email);
          this.next();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.displayError(`Failed to send OTP: ${error.message}`);
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
        error: (error: HttpErrorResponse) => {
          this.alertService.displayError(`Failed to verify OTP: ${error.message}`);
        },
      });
  }

  receiveSignUpRequest(registrationDetails: RegistrationDetails) {
    this.authService
      .register(registrationDetails)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.next();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.displayError(`Failed to sign up: ${error.message}`);
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
        error: (error: HttpErrorResponse) => {
          this.alertService.displayError(`Failed to log in: ${error.message}`);
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
