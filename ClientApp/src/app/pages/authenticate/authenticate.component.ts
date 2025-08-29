import { Component, inject, signal } from '@angular/core';
import { RegisterStepComponent } from './components/register-step/register-step.component';
import { OtpRequestStepComponent } from './components/otp-request-step/otp-request-step.component';
import { LoginStepComponent } from './components/login-step/login-step.component';
import { OtpVerifyStepComponent } from './components/otp-verify-step/otp-verify-step.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RegistrationDetails } from './Models/registration-details.model';

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

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['step'] === 'login') {
        this.step = AuthStep.Login;
      }
    });
  }

  receiveOtpRequest(email: string) {
    this.emailAddress.set(email);
    this.next();
  }

  receiveSignUpRequest(registrationDetails: RegistrationDetails) {
    this.next();
  }

  next() {
    if (this.step < AuthStep.Login) {
      this.step++;
    }
  }
}
