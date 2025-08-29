import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({ name: 'passwordErrorMessage', standalone: true })
export class PasswordErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined): string[] {
    if (!errors) return [];
    const errorKey = Object.keys(errors)[0];
    switch (errorKey) {
      case 'required':
        return ['Password is required.'];
      case 'lowercase':
        return ['Password must contain a lowercase letter.'];
      case 'uppercase':
        return ['Password must contain an uppercase letter.'];
      case 'digit':
        return ['Password must contain a number.'];
      case 'specialChar':
        return ['Password must contain a special character.'];
      case 'minLength':
        return ['Password must be at least 8 characters.'];
    }
    return [];
  }
}
