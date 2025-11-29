/**
 * Types pour la gestion des ventes/produits côté frontend
 */

export type ProductStatus = 
  | 'in_delivery'
  | 'to_list'
  | 'in_progress'
  | 'listed'
  | 'for_sale'
  | 'sold'
  | 'problem'
  | 'sold_euros'
  | 'in_stock'
  | 'in_stock_euros'

export interface Product {
  _id: string
  userId: string
  supplierOrderId: string
  name: string
  brand?: string
  size?: string
  quantity: number
  description?: string
  photos: string[] // URLs des photos
  url?: string
  unitCost: number
  totalCost?: number
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
  brand?: string
  size?: string
  quantity: number
  description?: string
  photos?: string[]
  url?: string
  unitCost: number
  totalCost?: number
  purchaseDate: string | Date
  salePrice: number
  soldPrice?: number
  soldTo?: string
  soldDate?: string | Date
  condition?: string
  platform?: string
  status?: ProductStatus
  boosted?: boolean
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
