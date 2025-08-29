import { Component, inject } from '@angular/core';
import { RegisterStepComponent } from './components/register-step/register-step.component';
import { OtpRequestStepComponent } from './components/otp-request-step/otp-request-step.component';
import { LoginStepComponent } from './components/login-step/login-step.component';
import { OtpVerifyStepComponent } from './components/otp-verify-step/otp-verify-step.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['step'] === 'login') {
        this.step = AuthStep.Login;
      }
    });
  }

  next() {
    if (this.step < AuthStep.Login) {
      this.step++;
    }
  }
}
