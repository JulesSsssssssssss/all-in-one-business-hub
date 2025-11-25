import { Request, Response, NextFunction } from 'express';
import { CONSTANTS } from '../config/constants';

/**
 * Middleware d'authentification (à implémenter avec Better Auth)
 * Pour le moment, on l'utilise pour les routes protégées
 */
export function authGuard(req: Request, res: Response, next: NextFunction) {
  // Récupérer le token depuis les headers
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: CONSTANTS.ERRORS.UNAUTHORIZED,
      statusCode: CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
    });
  }

  // Pour le moment, on accepte le token - à améliorer avec JWT
  (req as any).userId = token; // Placeholder

  next();
}
