import { PasswordErrorMessagePipe } from './password-error-message.pipe';
import { ValidationErrors } from '@angular/forms';

describe('PasswordErrorMessagePipe', () => {
  let pipe: PasswordErrorMessagePipe;

  beforeEach(() => {
    pipe = new PasswordErrorMessagePipe();
  });

  it('should return empty array if errors is null', () => {
    expect(pipe.transform(null as any)).toEqual([]);
  });

  it('should return empty array if errors is undefined', () => {
    expect(pipe.transform(undefined as any)).toEqual([]);
  });

  it('should return "Password is required." for required error', () => {
    const errors: ValidationErrors = { required: true };
    expect(pipe.transform(errors)).toEqual(['Password is required.']);
  });

  it('should return "Password must contain a lowercase letter." for lowercase error', () => {
    const errors: ValidationErrors = { lowercase: true };
    expect(pipe.transform(errors)).toEqual([
      'Password must contain a lowercase letter.',
    ]);
  });

  it('should return "Password must contain an uppercase letter." for uppercase error', () => {
    const errors: ValidationErrors = { uppercase: true };
    expect(pipe.transform(errors)).toEqual([
      'Password must contain an uppercase letter.',
    ]);
  });

  it('should return "Password must contain a number." for digit error', () => {
    const errors: ValidationErrors = { digit: true };
    expect(pipe.transform(errors)).toEqual(['Password must contain a number.']);
  });

  it('should return "Password must contain a special character." for specialChar error', () => {
    const errors: ValidationErrors = { specialChar: true };
    expect(pipe.transform(errors)).toEqual([
      'Password must contain a special character.',
    ]);
  });

  it('should return "Password must be at least 8 characters." for minLength error', () => {
    const errors: ValidationErrors = {
      minLength: { requiredLength: 8, actualLength: 5 },
    };
    expect(pipe.transform(errors)).toEqual([
      'Password must be at least 8 characters.',
    ]);
  });

  it('should return empty array for unknown error key', () => {
    const errors: ValidationErrors = { unknownError: true };
    expect(pipe.transform(errors)).toEqual([]);
  });

  it('should only return the first error message if multiple errors are present', () => {
    const errors: ValidationErrors = { required: true, lowercase: true };
    expect(pipe.transform(errors)).toEqual(['Password is required.']);
  });
});
