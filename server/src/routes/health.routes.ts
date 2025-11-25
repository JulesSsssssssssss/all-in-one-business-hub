import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const healthRouter = Router();

/**
 * GET /api/health
 * Vérifier l'état du serveur
 */
healthRouter.get('/', HealthController.check);

export { healthRouter };
