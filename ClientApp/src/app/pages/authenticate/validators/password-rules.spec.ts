import { AbstractControl } from '@angular/forms';
import {
  hasLowercase,
  hasUppercase,
  hasDigit,
  hasSpecialChar,
  minLength8,
} from './password-rules';

function mockControl(value: string | null | undefined): AbstractControl {
  return { value } as AbstractControl;
}

describe('Password Validators', () => {
  describe('hasLowercase', () => {
    it('should return null if value contains lowercase', () => {
      expect(hasLowercase(mockControl('abc'))).toBeNull();
      expect(hasLowercase(mockControl('A1b'))).toBeNull();
    });
    it('should return error if value does not contain lowercase', () => {
      expect(hasLowercase(mockControl('ABC123'))).toEqual({ lowercase: true });
      expect(hasLowercase(mockControl(''))).toEqual({ lowercase: true });
    });
  });

  describe('hasUppercase', () => {
    it('should return null if value contains uppercase', () => {
      expect(hasUppercase(mockControl('Abc'))).toBeNull();
      expect(hasUppercase(mockControl('a1B'))).toBeNull();
    });
    it('should return error if value does not contain uppercase', () => {
      expect(hasUppercase(mockControl('abc123'))).toEqual({ uppercase: true });
      expect(hasUppercase(mockControl(''))).toEqual({ uppercase: true });
    });
  });

  describe('hasDigit', () => {
    it('should return null if value contains digit', () => {
      expect(hasDigit(mockControl('abc1'))).toBeNull();
      expect(hasDigit(mockControl('1A'))).toBeNull();
    });
    it('should return error if value does not contain digit', () => {
      expect(hasDigit(mockControl('abcABC'))).toEqual({ digit: true });
      expect(hasDigit(mockControl(''))).toEqual({ digit: true });
    });
  });

  describe('hasSpecialChar', () => {
    it('should return null if value contains special character', () => {
      expect(hasSpecialChar(mockControl('abc!'))).toBeNull();
      expect(hasSpecialChar(mockControl('A@1'))).toBeNull();
    });
    it('should return error if value does not contain special character', () => {
      expect(hasSpecialChar(mockControl('abc123'))).toEqual({
        specialChar: true,
      });
      expect(hasSpecialChar(mockControl(''))).toEqual({ specialChar: true });
    });
  });

  describe('minLength8', () => {
    it('should return null if value length is at least 8', () => {
      expect(minLength8(mockControl('abcdefgh'))).toBeNull();
      expect(minLength8(mockControl('12345678'))).toBeNull();
    });
    it('should return error if value length is less than 8', () => {
      expect(minLength8(mockControl('abc'))).toEqual({ minLength: true });
      expect(minLength8(mockControl(''))).toEqual({ minLength: true });
      expect(minLength8(mockControl(null))).toEqual({ minLength: true });
      expect(minLength8(mockControl(undefined))).toEqual({ minLength: true });
    });
  });
});
