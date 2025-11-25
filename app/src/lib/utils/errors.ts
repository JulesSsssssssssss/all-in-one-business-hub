/**
 * Utilitaires d'erreur
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Une erreur inconnue est survenue';
}

export function isApiError(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}
