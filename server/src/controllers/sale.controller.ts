import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/api'
import saleService from '../services/sale.service'
import type {
  ICreateProductInput,
  IListProductInput,
  ISellProductInput,
  IUpdateProductInput,
  IProductFilter
} from '../types/sale'

/**
 * Controller pour la gestion des ventes
 * Respecte le principe Single Responsibility
 */
export class SaleController {
  /**
   * POST /api/sales/products - Créer un nouveau produit
   */
  async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const input: ICreateProductInput = req.body

      // Validation basique (salePrice est optionnel, sera 0 par défaut)
      if (!input.name || !input.supplierOrderId || input.unitCost === undefined || input.unitCost === null) {
        res.status(400).json({
          error: 'Missing required fields: name, supplierOrderId, unitCost'
        })
        return
      }

      const product = await saleService.createProduct(userId, input)

      res.status(201).json({
        message: 'Product created successfully',
        product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/sales/products/:id - Obtenir un produit par ID
   */
  async getProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const product = await saleService.getProductById(id, userId)

      if (!product) {
        res.status(404).json({ error: 'Product not found' })
        return
      }

      res.json({ product })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/sales/products - Obtenir tous les produits avec filtres
   */
  async getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const {
        status,
        supplierOrderId,
        platform,
        minPrice,
        maxPrice,
        dateFrom,
        dateTo,
        page = '1',
        limit = '50'
      } = req.query

      const filter: IProductFilter = {
        userId,
        status: status as any,
        supplierOrderId: supplierOrderId as string,
        platform: platform as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined
      }

      const result = await saleService.getProducts(
        filter,
        parseInt(page as string),
        parseInt(limit as string)
      )

      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/sales/products/:id/list - Mettre en vente un produit
   */
  async listProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params
      const input: Omit<IListProductInput, 'productId'> = req.body

      if (!input.platform) {
        res.status(400).json({ error: 'Platform is required' })
        return
      }

      const product = await saleService.listProduct(userId, {
        productId: id,
        ...input
      })

      if (!product) {
        res.status(404).json({ error: 'Product not found or already listed' })
        return
      }

      res.json({
        message: 'Product listed successfully',
        product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/sales/products/:id/sell - Marquer un produit comme vendu
   */
  async sellProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params
      const input: Omit<ISellProductInput, 'productId'> = req.body

      if (!input.soldPrice || !input.soldTo) {
        res.status(400).json({ error: 'soldPrice and soldTo are required' })
        return
      }

      const product = await saleService.sellProduct(userId, {
        productId: id,
        ...input
      })

      if (!product) {
        res.status(404).json({ error: 'Product not found or already sold' })
        return
      }

      res.json({
        message: 'Product sold successfully',
        product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/sales/products/:id - Mettre à jour un produit
   */
  async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params
      const updates: IUpdateProductInput = req.body

      const product = await saleService.updateProduct(id, userId, updates)

      if (!product) {
        res.status(404).json({ error: 'Product not found' })
        return
      }

      res.json({
        message: 'Product updated successfully',
        product
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/sales/products/:id - Supprimer un produit
   */
  async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const deleted = await saleService.deleteProduct(id, userId)

      if (!deleted) {
        res.status(404).json({ error: 'Product not found' })
        return
      }

      res.json({ message: 'Product deleted successfully' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/sales/stats - Obtenir les statistiques de vente
   */
  async getSaleStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const stats = await saleService.getSaleStats(userId)

      res.json({ stats })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/sales/supplier-orders/:id/products - Obtenir les produits d'une commande
   */
  async getProductsBySupplierOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const products = await saleService.getProductsBySupplierOrder(id, userId)

      res.json({ products })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/sales/products/:id/boost - Booster/débooster un produit
   */
  async toggleBoost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const { id } = req.params

      const product = await saleService.toggleBoost(id, userId)

      if (!product) {
        res.status(404).json({ error: 'Product not found' })
        return
      }

      res.json({
        message: `Product ${product.boosted ? 'boosted' : 'unboosted'} successfully`,
        product
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new SaleController()
