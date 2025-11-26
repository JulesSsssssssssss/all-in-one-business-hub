import type { Types } from 'mongoose'

/**
 * Interface pour une vente complète
 */
export interface ISale {
  _id: Types.ObjectId
  userId: Types.ObjectId
  supplierOrderId: Types.ObjectId
  name: string // Description
  brand?: string // Marque
  size?: string // Taille
  quantity: number
  description?: string
  photos: string[] // URLs des photos
  url?: string // URL de vente (plateforme)
  unitCost: number // Prix d'achat unitaire
  totalCost: number // Prix total (quantity * unitCost)
  purchaseDate: Date // Date achat
  salePrice: number // Prix de vente prévu
  soldPrice?: number // Vendu à combien
  soldTo?: string
  status: 'in_delivery' | 'to_list' | 'in_progress' | 'listed' | 'for_sale' | 'completed' | 'sold' | 'problem' | 'sold_euros'
  condition?: string
  platform?: string
  listedDate?: Date
  soldDate?: Date // Date vente
  boosted: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Input pour créer un produit
 */
export interface ICreateProductInput {
  supplierOrderId: string
  name: string // Description
  brand?: string // Marque
  size?: string // Taille
  quantity: number
  description?: string
  photos?: string[]
  url?: string // URL plateforme
  unitCost: number // Prix achat unitaire
  totalCost?: number // Prix total (calculé: quantity * unitCost)
  purchaseDate: Date | string // Date achat
  salePrice?: number // Prix de vente prévu
  soldPrice?: number // Vendu à combien
  soldDate?: Date | string // Date vente
  status?: 'in_delivery' | 'to_list' | 'in_progress' | 'listed' | 'for_sale' | 'completed' | 'sold' | 'problem' | 'sold_euros'
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
  brand?: string
  size?: string
  quantity?: number
  description?: string
  photos?: string[]
  unitCost?: number
  totalCost?: number
  salePrice?: number
  soldPrice?: number
  soldDate?: Date | string
  purchaseDate?: Date | string
  condition?: string
  platform?: string
  boosted?: boolean
  status?: string
  url?: string
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
