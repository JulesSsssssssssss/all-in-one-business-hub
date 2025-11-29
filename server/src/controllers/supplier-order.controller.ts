import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/api'
import supplierOrderService from '../services/supplier-order.service'
import type {
  ICreateSupplierOrderInput,
  IUpdateSupplierOrderInput
} from '../services/supplier-order.service'

/**
 * Controller pour la gestion des commandes fournisseurs
 */
export class SupplierOrderController {
  /**
   * POST /api/supplier-orders - Créer une commande
   */
  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const input: ICreateSupplierOrderInput = req.body

      if (!input.name || !input.supplier || !input.totalCost) {
        res.status(400).json({
          error: 'Missing required fields: name, supplier, totalCost'
        })
        return
      }

      const order = await supplierOrderService.createOrder(userId, input)

      res.status(201).json({
        message: 'Supplier order created successfully',
        order
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/supplier-orders/:id - Obtenir une commande
   */
  async getOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const order = await supplierOrderService.getOrderById(id, userId)

      if (!order) {
        res.status(404).json({ error: 'Supplier order not found' })
        return
      }

      res.json({ order })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/supplier-orders - Obtenir toutes les commandes
   */
  async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { status } = req.query

      const orders = await supplierOrderService.getOrders(
        userId,
        status as 'active' | 'completed' | undefined
      )

      res.json({ orders })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/supplier-orders/:id - Mettre à jour une commande
   */
  async updateOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params
      const updates: IUpdateSupplierOrderInput = req.body

      const order = await supplierOrderService.updateOrder(id, userId, updates)

      if (!order) {
        res.status(404).json({ error: 'Supplier order not found' })
        return
      }

      res.json({
        message: 'Supplier order updated successfully',
        order
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/supplier-orders/:id - Supprimer une commande
   */
  async deleteOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const deleted = await supplierOrderService.deleteOrder(id, userId)

      if (!deleted) {
        res.status(404).json({ error: 'Supplier order not found' })
        return
      }

      res.json({ message: 'Supplier order deleted successfully' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/supplier-orders/:id/complete - Marquer comme complétée
   */
  async completeOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const order = await supplierOrderService.completeOrder(id, userId)

      if (!order) {
        res.status(404).json({ error: 'Supplier order not found' })
        return
      }

      res.json({
        message: 'Supplier order completed successfully',
        order
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new SupplierOrderController()
