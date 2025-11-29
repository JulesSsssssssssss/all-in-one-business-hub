import type { Types } from 'mongoose'

/**
 * Interface pour une vente complète
 */
export interface ISale {
  _id: Types.ObjectId
  userId: Types.ObjectId
  supplierOrderId: Types.ObjectId
  name: string
  size?: string
  quantity: number
  description?: string
  photos: string[] // URLs des photos
  unitCost: number
  purchaseDate: Date
  salePrice: number
  soldPrice?: number
  soldTo?: string
  status: 'in_stock' | 'listed' | 'sold'
  condition?: string
  platform?: string
  listedDate?: Date
  soldDate?: Date
  boosted: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Input pour créer un produit
 */
export interface ICreateProductInput {
  supplierOrderId: string
  name: string
  size?: string
  quantity: number
  description?: string
  photos?: string[]
  unitCost: number
  purchaseDate: Date | string
  salePrice: number
  condition?: string
  platform?: string
}

/**
 * Input pour mettre en vente un produit
 */
export interface IListProductInput {
  productId: string
  platform: string
  listedDate?: Date | string
  boosted?: boolean
}

/**
 * Input pour marquer un produit comme vendu
 */
export interface ISellProductInput {
  productId: string
  soldPrice: number
  soldTo: string
  soldDate?: Date | string
  platform?: string
}

/**
 * Input pour mettre à jour un produit
 */
export interface IUpdateProductInput {
  name?: string
  size?: string
  quantity?: number
  description?: string
  photos?: string[]
  unitCost?: number
  salePrice?: number
  condition?: string
  platform?: string
  boosted?: boolean
}

/**
 * Statistiques de vente
 */
export interface ISaleStats {
  totalProducts: number
  inStock: number
  listed: number
  sold: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  averageMargin: number
}

/**
 * Filtre pour rechercher des produits
 */
export interface IProductFilter {
  userId: string
  status?: 'in_stock' | 'listed' | 'sold'
  supplierOrderId?: string
  platform?: string
  minPrice?: number
  maxPrice?: number
  dateFrom?: Date
  dateTo?: Date
}

/**
 * Résultat paginé de produits
 */
export interface IProductsResult {
  products: ISale[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
