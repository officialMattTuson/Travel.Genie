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
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  minLength8,
  hasLowercase,
  hasUppercase,
  hasDigit,
  hasSpecialChar,
} from '../../validators/password-rules';
import { PasswordErrorMessagePipe } from '../../pipes/password-error-message.pipe';
import { RegistrationDetails } from '../../Models/registration-details.model';

@Component({
  selector: 'app-register-step',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    PasswordErrorMessagePipe,
  ],
  templateUrl: './register-step.component.html',
  styleUrls: ['./register-step.component.scss'],
})
export class RegisterStepComponent {
  submissionAttempted = false;
  hidePassword = true;
  @Input() emailAddress!: Signal<string>;
  @Output() registrationRequest = new EventEmitter<RegistrationDetails>();
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      minLength8,
      hasLowercase,
      hasUppercase,
      hasDigit,
      hasSpecialChar,
    ]),
  });

  constructor() {
    effect(() => {
      this.registrationForm.get('email')?.setValue(this.emailAddress());
      this.registrationForm.get('email')?.disable();
    });
  }

  signUp() {
    this.submissionAttempted = true;
    if (this.registrationForm.valid) {
      this.registrationRequest.emit(
        this.registrationForm.value as RegistrationDetails
      );
    }
  }
}
