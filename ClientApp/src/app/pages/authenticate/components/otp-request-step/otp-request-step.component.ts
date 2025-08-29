import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-request-step',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './otp-request-step.component.html',
  styleUrl: './otp-request-step.component.scss',
})
export class OtpRequestStepComponent {

  @Output() otpRequested = new EventEmitter<string>();

  submissionAttempted = false;
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  private readonly router = inject(Router);

  sendVerificationEmail() {
    this.submissionAttempted = true;
    if (this.emailForm.valid) {
      const email = String(this.emailForm.get('email')?.value);
      this.otpRequested.emit(email);
    }
  }

  returnHome() {
    this.router.navigate(['home']);
  }
}
