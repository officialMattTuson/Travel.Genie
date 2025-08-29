import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RegistrationDetails } from '../../Models/registration-details.model';

@Component({
  selector: 'app-login-step',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './login-step.component.html',
  styleUrl: './login-step.component.scss',
})
export class LoginStepComponent {
  @Input() emailAddress!: Signal<string>;
  @Output() loginRequest = new EventEmitter<RegistrationDetails>();

  submissionAttempted = false;
  hidePassword = true;

  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor() {
    effect(() => {
      this.registrationForm.get('email')?.setValue(this.emailAddress());
    });
  }

  signIn() {
    this.submissionAttempted = true;
    if (!this.registrationForm.valid) {
      return this.registrationForm.markAllAsTouched();
    }
    this.loginRequest.emit({
      email: String(this.registrationForm.get('email')?.value),
      password: String(this.registrationForm.get('password')?.value),
    });
  }
}
