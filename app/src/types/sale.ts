/**
 * Types pour la gestion des ventes/produits côté frontend
 */

export type ProductStatus = 'in_stock' | 'listed' | 'sold'

export interface Product {
  _id: string
  userId: string
  supplierOrderId: string
  name: string
  size?: string
  quantity: number
  description?: string
  photos: string[] // URLs des photos
  unitCost: number
  purchaseDate: string
  salePrice: number
  soldPrice?: number
  soldTo?: string
  status: ProductStatus
  condition?: string
  platform?: string
  listedDate?: string
  soldDate?: string
  boosted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductInput {
  supplierOrderId: string
  name: string
  size?: string
  quantity: number
  description?: string
  photos?: string[]
  unitCost: number
  purchaseDate: string | Date
  salePrice: number
  condition?: string
  platform?: string
}

export interface ListProductInput {
  platform: string
  listedDate?: string | Date
  boosted?: boolean
}

export interface SellProductInput {
  soldPrice: number
  soldTo: string
  soldDate?: string | Date
  platform?: string
}

export interface UpdateProductInput {
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

export interface SaleStats {
  totalProducts: number
  inStock: number
  listed: number
  sold: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  averageMargin: number
}

export interface ProductFilter {
  status?: ProductStatus
  supplierOrderId?: string
  platform?: string
  minPrice?: number
  maxPrice?: number
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ProductResponse {
  product: Product
}

export interface SaleStatsResponse {
  stats: SaleStats
}

export interface CreateProductResponse {
  message: string
  product: Product
}

export interface UpdateProductResponse {
  message: string
  product: Product
}

export interface DeleteProductResponse {
  message: string
}
