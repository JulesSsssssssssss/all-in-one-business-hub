import { Router } from 'express'
import analyticsController from '../controllers/analytics.controller'
import { authGuard } from '../middleware/auth-guard'

const router = Router()

/**
 * GET /api/analytics/dashboard
 * Obtenir les analytics du dashboard
 */
router.get('/dashboard', authGuard, analyticsController.getDashboardAnalytics)

export default router
