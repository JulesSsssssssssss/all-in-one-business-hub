import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';
import { CONSTANTS } from '../config/constants';
import { createLogger } from '../lib/logger';

const logger = createLogger('ErrorHandler');

/**
 * Middleware global pour la gestion des erreurs
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) {
  logger.error('Une erreur est survenue', error);

  const statusCode = (error as any).statusCode || CONSTANTS.HTTP_STATUS.INTERNAL_ERROR;
  const message = error.message || CONSTANTS.ERRORS.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
}

/**
 * Middleware pour les routes non trouvées
 */
export function notFoundHandler(req: Request, res: Response<ApiResponse>) {
  res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route ${req.path} non trouvée`,
    statusCode: CONSTANTS.HTTP_STATUS.NOT_FOUND,
  });
}
