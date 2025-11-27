/**
 * Types pour la gestion des ventes/produits côté frontend
 */

export type ProductStatus = 
  | 'in_delivery' // En cours de livraison
  | 'to_list' // À faire (à mettre en vente)
  | 'in_progress' // En cours (mise en vente en cours)
  | 'listed' // À mettre en vente
  | 'for_sale' // En vente
  | 'completed' // Terminé (états finaux ci-dessous)
  | 'sold' // ACHAT (vendu)
  | 'problem' // Problème
  | 'sold_euros' // Vendu €€€

export interface Product {
  _id: string
  userId: string
  supplierOrderId: string
  name: string // Description
  brand?: string // Marque
  size?: string // Taille
  quantity: number
  description?: string
  photos: string[] // URLs des photos
  url?: string // URL de vente (plateforme)
  unitCost: number // Prix d'achat unitaire
  totalCost: number // Prix total (quantity * unitCost)
  purchaseDate: string // Date achat
  salePrice: number // Prix de vente prévu
  soldPrice?: number // Vendu à combien
  soldTo?: string
  status: ProductStatus // État de la commande
  condition?: string
  platform?: string
  listedDate?: string
  soldDate?: string // Date vente
  boosted: boolean
  
  // Calculs de bénéfice
  profitWithoutAcre?: number // Bénéfice sans ACRE
  profitWithAcre?: number // Bénéfice avec ACRE
  profitMargin?: number // Marge en %
  
  createdAt: string
  updatedAt: string
}

export interface CreateProductInput {
  supplierOrderId: string
  name: string // Description
  brand?: string // Marque
  size?: string // Taille
  quantity: number
  description?: string
  photos?: string[] // Photos
  url?: string // URL plateforme
  unitCost: number // Prix achat unitaire
  totalCost?: number // Prix total (calculé: quantity * unitCost)
  purchaseDate: string | Date // Date achat (auto si commande sélectionnée)
  salePrice: number // Prix de vente prévu
  soldPrice?: number // Vendu à combien
  soldDate?: string | Date // Date vente
  status: ProductStatus // État de la commande
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
