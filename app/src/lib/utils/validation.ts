/**
 * Utilitaires de validation
 */

import { VALIDATION, ERROR_MESSAGES } from '@/constants/app';

export function validateEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PASSWORD_WEAK,
    };
  }

  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Le mot de passe ne doit pas dépasser ${VALIDATION.PASSWORD_MAX_LENGTH} caractères`,
    };
  }

  return { isValid: true };
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  error?: string;
} {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PASSWORD_MISMATCH,
    };
  }

  return { isValid: true };
}
