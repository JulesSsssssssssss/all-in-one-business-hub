import { Types } from 'mongoose'
import ProductModel, { type IProductDocument } from '../db/models/product.model'
import type {
  ICreateProductInput,
  IListProductInput,
  ISellProductInput,
  IUpdateProductInput,
  IProductFilter,
  IProductsResult,
  ISaleStats
} from '../types/sale'

/**
 * Service de gestion des ventes (produits)
 * Respecte le principe Single Responsibility
 */
export class SaleService {
  /**
   * Créer un nouveau produit
   */
  async createProduct(userId: string, input: ICreateProductInput): Promise<IProductDocument> {
    // Calcul automatique du coût total
    const totalCost = input.totalCost || (input.quantity * input.unitCost);

    const product = await ProductModel.create({
      userId: new Types.ObjectId(userId),
      supplierOrderId: new Types.ObjectId(input.supplierOrderId),
      name: input.name,
      brand: input.brand,
      size: input.size,
      quantity: input.quantity,
      description: input.description,
      photos: JSON.stringify(input.photos || []),
      url: input.url,
      unitCost: input.unitCost,
      totalCost: totalCost,
      purchaseDate: new Date(input.purchaseDate),
      salePrice: input.salePrice || 0,
      soldPrice: input.soldPrice,
      soldDate: input.soldDate ? new Date(input.soldDate) : undefined,
      condition: input.condition,
      platform: input.platform,
      status: input.status || 'to_list'
    })

    return product
  }

  /**
   * Obtenir un produit par ID
   */
  async getProductById(productId: string, userId: string): Promise<IProductDocument | null> {
    const product = await ProductModel.findOne({
      _id: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId)
    })

    return product
  }

  /**
   * Obtenir tous les produits d'un utilisateur avec filtres
   */
  async getProducts(
    filter: IProductFilter,
    page: number = 1,
    limit: number = 50
  ): Promise<IProductsResult> {
    const query: any = {
      userId: new Types.ObjectId(filter.userId)
    }

    // Filtres optionnels
    if (filter.status) {
      query.status = filter.status
    }

    if (filter.supplierOrderId) {
      query.supplierOrderId = new Types.ObjectId(filter.supplierOrderId)
    }

    if (filter.platform) {
      query.platform = filter.platform
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.salePrice = {}
      if (filter.minPrice !== undefined) query.salePrice.$gte = filter.minPrice
      if (filter.maxPrice !== undefined) query.salePrice.$lte = filter.maxPrice
    }

    if (filter.dateFrom || filter.dateTo) {
      // Filtrer par date de vente (soldDate) si disponible, sinon par date de création
      const dateField = 'soldDate'
      query[dateField] = {}
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom)
        fromDate.setHours(0, 0, 0, 0)
        query[dateField].$gte = fromDate
      }
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo)
        toDate.setHours(23, 59, 59, 999)
        query[dateField].$lte = toDate
      }
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('supplierOrderId'),
      ProductModel.countDocuments(query)
    ])

    return {
      products: products as any,
      total,
      page,
      limit,
      hasMore: skip + products.length < total
    }
  }

  /**
   * Mettre en vente un produit (marquer comme "listed")
   */
  async listProduct(userId: string, input: IListProductInput): Promise<IProductDocument | null> {
    const product = await ProductModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(input.productId),
        userId: new Types.ObjectId(userId),
        status: 'in_stock'
      },
      {
        $set: {
          status: 'listed',
          platform: input.platform,
          listedDate: input.listedDate ? new Date(input.listedDate) : new Date(),
          boosted: input.boosted ?? false
        }
      },
      { new: true }
    )

    return product
  }

  /**
   * Marquer un produit comme vendu
   */
  async sellProduct(userId: string, input: ISellProductInput): Promise<IProductDocument | null> {
    const product = await ProductModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(input.productId),
        userId: new Types.ObjectId(userId),
        status: { $in: ['in_stock', 'listed'] }
      },
      {
        $set: {
          status: 'sold',
          soldPrice: input.soldPrice,
          soldTo: input.soldTo,
          soldDate: input.soldDate ? new Date(input.soldDate) : new Date(),
          platform: input.platform || undefined
        }
      },
      { new: true }
    )

    return product
  }

  /**
   * Mettre à jour un produit
   */
  async updateProduct(
    productId: string,
    userId: string,
    updates: IUpdateProductInput
  ): Promise<IProductDocument | null> {
    const updateData: any = {}

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.brand !== undefined) updateData.brand = updates.brand
    if (updates.size !== undefined) updateData.size = updates.size
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.photos !== undefined) updateData.photos = JSON.stringify(updates.photos)
    if (updates.unitCost !== undefined) updateData.unitCost = updates.unitCost
    if (updates.totalCost !== undefined) updateData.totalCost = updates.totalCost
    if (updates.salePrice !== undefined) updateData.salePrice = updates.salePrice
    if (updates.soldPrice !== undefined) updateData.soldPrice = updates.soldPrice
    if (updates.soldDate !== undefined) updateData.soldDate = updates.soldDate
    if (updates.purchaseDate !== undefined) updateData.purchaseDate = updates.purchaseDate
    if (updates.condition !== undefined) updateData.condition = updates.condition
    if (updates.platform !== undefined) updateData.platform = updates.platform
    if (updates.boosted !== undefined) updateData.boosted = updates.boosted
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.url !== undefined) updateData.url = updates.url

    const product = await ProductModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        userId: new Types.ObjectId(userId)
      },
      { $set: updateData },
      { new: true }
    )

    return product
  }

  /**
   * Supprimer un produit
   */
  async deleteProduct(productId: string, userId: string): Promise<boolean> {
    const result = await ProductModel.deleteOne({
      _id: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId)
    })

    return result.deletedCount > 0
  }

  /**
   * Obtenir les statistiques de vente d'un utilisateur
   */
  async getSaleStats(userId: string): Promise<ISaleStats> {
    const products = await ProductModel.find({
      userId: new Types.ObjectId(userId)
    })

    const stats: ISaleStats = {
      totalProducts: products.length,
      inStock: 0,
      listed: 0,
      sold: 0,
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      averageMargin: 0
    }

    products.forEach(product => {
      // Compter les statuts
      if (product.status === 'in_stock') stats.inStock++
      if (product.status === 'listed') stats.listed++
      if (product.status === 'sold') {
        stats.sold++
        stats.totalRevenue += product.soldPrice || 0
      }

      // Calculer les coûts
      stats.totalCost += product.unitCost * product.quantity
    })

    // Calculer le profit et la marge
    stats.totalProfit = stats.totalRevenue - stats.totalCost
    stats.averageMargin = stats.totalRevenue > 0
      ? ((stats.totalProfit / stats.totalRevenue) * 100)
      : 0

    return stats
  }

  /**
   * Obtenir les produits par commande fournisseur
   */
  async getProductsBySupplierOrder(
    supplierOrderId: string,
    userId: string
  ): Promise<IProductDocument[]> {
    const products = await ProductModel.find({
      supplierOrderId: new Types.ObjectId(supplierOrderId),
      userId: new Types.ObjectId(userId)
    }).sort({ createdAt: -1 })

    return products
  }

  /**
   * Booster/débooster un produit
   */
  async toggleBoost(productId: string, userId: string): Promise<IProductDocument | null> {
    const product = await this.getProductById(productId, userId)
    if (!product) return null

    product.boosted = !product.boosted
    await product.save()

    return product
  }
}

export default new SaleService()
