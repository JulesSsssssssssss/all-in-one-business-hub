/**
 * Routes de l'application
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
} as const;

/**
 * Endpoints API
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  HEALTH: '/health',
} as const;

/**
 * Messages d'erreur
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  USER_EXISTS: 'Un utilisateur avec cet email existe déjà',
  PASSWORD_WEAK: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  SERVER_ERROR: 'Une erreur serveur est survenue',
  NETWORK_ERROR: 'Erreur de connexion',
} as const;

/**
 * Validation
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
