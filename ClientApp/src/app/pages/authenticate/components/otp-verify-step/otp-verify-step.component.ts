import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
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

@Component({
  selector: 'app-otp-verify-step',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './otp-verify-step.component.html',
  styleUrl: './otp-verify-step.component.scss',
})
export class OtpVerifyStepComponent {
  @Input() emailAddress!: Signal<string>;
  @Output() otpVerified = new EventEmitter<string>();
  submissionAttempted = false;
  otpRequestForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{6}$/),
    ]),
  });

  verifyOtpRequest() {
    this.submissionAttempted = true;
    if (this.otpRequestForm.valid) {
      this.otpVerified.emit(String(this.otpRequestForm.get('otp')?.value));
    }
  }
}
