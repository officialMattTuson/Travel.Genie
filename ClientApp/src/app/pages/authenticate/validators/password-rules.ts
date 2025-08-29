import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasLowercase(
  control: AbstractControl
): ValidationErrors | null {
  return /[a-z]/.test(control.value) ? null : { lowercase: true };
}
export function hasUppercase(
  control: AbstractControl
): ValidationErrors | null {
  return /[A-Z]/.test(control.value) ? null : { uppercase: true };
}
export function hasDigit(control: AbstractControl): ValidationErrors | null {
  return /\d/.test(control.value) ? null : { digit: true };
}
export function hasSpecialChar(
  control: AbstractControl
): ValidationErrors | null {
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(control.value)
    ? null
    : { specialChar: true };
}
export function minLength8(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value.length >= 8
    ? null
    : { minLength: true };
}
