import { Request, Response } from 'express';
import { ApiResponse } from '../types/api';
import { CONSTANTS } from '../config/constants';

export class HealthController {
  /**
   * GET /api/health
   * Vérifier l'état du serveur
   */
  static check(req: Request, res: Response<ApiResponse>) {
    res.status(CONSTANTS.HTTP_STATUS.OK).json({
      success: true,
      data: {
        status: 'Server is running',
        timestamp: new Date().toISOString(),
      },
      statusCode: CONSTANTS.HTTP_STATUS.OK,
    });
  }
}
