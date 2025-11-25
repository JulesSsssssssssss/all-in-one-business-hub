export const CONSTANTS = {
  // HTTP Status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  },

  // Authentication
  AUTH: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    SESSION_DURATION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // API
  API: {
    VERSION: 'v1',
    TIMEOUT_MS: 30000,
  },

  // Error messages
  ERRORS: {
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
    USER_NOT_FOUND: 'Utilisateur non trouvé',
    USER_EXISTS: 'Un utilisateur avec cet email existe déjà',
    PASSWORD_WEAK: `Le mot de passe doit contenir au moins ${8} caractères`,
    UNAUTHORIZED: 'Non autorisé',
    SERVER_ERROR: 'Une erreur serveur est survenue',
  },
} as const;
