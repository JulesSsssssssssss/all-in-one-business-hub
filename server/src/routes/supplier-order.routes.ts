import { Router } from 'express'
import supplierOrderController from '../controllers/supplier-order.controller'
import { authGuard } from '../middleware/auth-guard'

const router = Router()

/**
 * Routes pour la gestion des commandes fournisseurs
 * Toutes les routes nécessitent une authentification
 */

router.post('/', async (req, res, next) => {
  await authGuard(req, res, () => supplierOrderController.createOrder(req, res, next));
});

router.get('/', async (req, res, next) => {
  await authGuard(req, res, () => supplierOrderController.getOrders(req, res, next));
});

router.get('/:id', async (req, res, next) => {
  await authGuard(req, res, () => supplierOrderController.getOrder(req, res, next));
});

router.put('/:id', async (req, res, next) => {
  await authGuard(req, res, () => supplierOrderController.updateOrder(req, res, next));
});

router.delete('/:id', async (req, res, next) => {
  await authGuard(req, res, () => supplierOrderController.deleteOrder(req, res, next));
});

router.put('/:id/complete', async (req, res, next) => {
  await authGuard(req, res, () => supplierOrderController.completeOrder(req, res, next));
});

export default router
