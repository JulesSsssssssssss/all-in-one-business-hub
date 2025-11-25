import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { SignUpRequest, SignInRequest } from '../types/auth';
import { ApiResponse } from '../types/api';
import { CONSTANTS } from '../config/constants';
import { createLogger } from '../lib/logger';

const logger = createLogger('AuthController');

export class AuthController {
  /**
   * POST /api/auth/register
   * ⚠️ Better Auth gère l'inscription automatiquement
   * Cette route est conservée pour compatibilité
   */
  static async register(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      return res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: { message: 'Utilisez Better Auth pour l\'inscription' },
        statusCode: CONSTANTS.HTTP_STATUS.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * ⚠️ Better Auth gère la connexion automatiquement
   * Cette route est conservée pour compatibilité
   */
  static async login(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      return res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: { message: 'Utilisez Better Auth pour la connexion' },
        statusCode: CONSTANTS.HTTP_STATUS.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Récupérer l'utilisateur courant
   */
  static async getMe(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const userId = (req as any).userId; // Défini par le middleware d'auth

      if (!userId) {
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: CONSTANTS.ERRORS.UNAUTHORIZED,
          statusCode: CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
        });
      }

      const user = await AuthService.getUserById(userId);

      res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: user,
        statusCode: CONSTANTS.HTTP_STATUS.OK,
      });
    } catch (error) {
      next(error);
    }
  }
}
