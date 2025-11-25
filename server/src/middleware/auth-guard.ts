import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth';
import { CONSTANTS } from '../config/constants';

/**
 * Middleware d'authentification avec Better Auth
 * Vérifie la session utilisateur via les cookies
 */
export async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    // Better Auth vérifie automatiquement la session via les cookies
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Non authentifié',
        statusCode: CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      });
    }

    // Ajouter l'utilisateur à la requête
    (req as any).user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };

    next();
  } catch (error) {
    console.error('Auth guard error:', error);
    return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Erreur d\'authentification',
      statusCode: CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
    });
  }
}
