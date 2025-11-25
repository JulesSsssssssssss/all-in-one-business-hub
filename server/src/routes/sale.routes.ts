import { Router } from 'express'
import saleController from '../controllers/sale.controller'
import { authGuard } from '../middleware/auth-guard'

const router = Router()

/**
 * Routes pour la gestion des ventes (produits)
 * Toutes les routes nécessitent une authentification
 */

// Routes pour les produits
router.post('/products', async (req, res, next) => {
  await authGuard(req, res, () => saleController.createProduct(req, res, next));
});

router.get('/products', async (req, res, next) => {
  await authGuard(req, res, () => saleController.getProducts(req, res, next));
});

router.get('/products/:id', async (req, res, next) => {
  await authGuard(req, res, () => saleController.getProduct(req, res, next));
});

router.put('/products/:id', async (req, res, next) => {
  await authGuard(req, res, () => saleController.updateProduct(req, res, next));
});

router.delete('/products/:id', async (req, res, next) => {
  await authGuard(req, res, () => saleController.deleteProduct(req, res, next));
});

// Routes pour les actions de vente
router.put('/products/:id/list', async (req, res, next) => {
  await authGuard(req, res, () => saleController.listProduct(req, res, next));
});

router.put('/products/:id/sell', async (req, res, next) => {
  await authGuard(req, res, () => saleController.sellProduct(req, res, next));
});

router.put('/products/:id/boost', async (req, res, next) => {
  await authGuard(req, res, () => saleController.toggleBoost(req, res, next));
});

// Routes pour les statistiques
router.get('/stats', async (req, res, next) => {
  await authGuard(req, res, () => saleController.getSaleStats(req, res, next));
});

// Routes pour les commandes fournisseurs
router.get('/supplier-orders/:id/products', async (req, res, next) => {
  await authGuard(req, res, () => saleController.getProductsBySupplierOrder(req, res, next));
});

export default router
