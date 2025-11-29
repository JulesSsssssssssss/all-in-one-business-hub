import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/api'
import analyticsService from '../services/analytics.service'

/**
 * Controller pour les analytics
 */
class AnalyticsController {
  /**
   * Obtenir le dashboard analytics complet
   * GET /api/analytics/dashboard
   */
  async getDashboardAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Non authentifié' })
      }

      // Récupérer le statut ACRE de l'utilisateur (à implémenter depuis le profil)
      const hasAcre = req.query.hasAcre === 'true' || false

      const analytics = await analyticsService.getDashboardAnalytics(userId, hasAcre)
      
      res.json({ analytics })
    } catch (error) {
      next(error)
    }
  }
}

export default new AnalyticsController()
