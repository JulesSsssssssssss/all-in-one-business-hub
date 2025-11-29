import { useState, useCallback } from 'react'
import type {
  Product,
  CreateProductInput,
  ListProductInput,
  SellProductInput,
  UpdateProductInput,
  ProductFilter,
  ProductsResponse,
  SaleStats,
  CreateProductResponse,
  UpdateProductResponse
} from '@/types/sale'

// Réexporter les types pour les composants
export type {
  Product,
  CreateProductInput,
  ListProductInput,
  SellProductInput,
  UpdateProductInput,
  ProductFilter,
  ProductsResponse,
  SaleStats
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * Hook pour gérer les ventes/produits
 * Centralise tous les appels API liés aux ventes
 */
export function useSales() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fonction helper pour les appels API avec authentification
   */
  const apiCall = useCallback(async <T,>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setLoading(true)
    setError(null)

    try {
      // Better Auth utilise les cookies automatiquement
      // On envoie credentials: 'include' pour que les cookies soient envoyés
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Important pour Better Auth
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Créer un nouveau produit
   */
  const createProduct = useCallback(
    async (input: CreateProductInput): Promise<Product> => {
      const response = await apiCall<CreateProductResponse>('/sales/products', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      return response.product
    },
    [apiCall]
  )

  /**
   * Obtenir tous les produits avec filtres
   */
  const getProducts = useCallback(
    async (filter?: ProductFilter): Promise<ProductsResponse> => {
      const params = new URLSearchParams()
      
      if (filter) {
        if (filter.status) params.append('status', filter.status)
        if (filter.supplierOrderId) params.append('supplierOrderId', filter.supplierOrderId)
        if (filter.platform) params.append('platform', filter.platform)
        if (filter.minPrice) params.append('minPrice', filter.minPrice.toString())
        if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString())
        if (filter.dateFrom) params.append('dateFrom', filter.dateFrom)
        if (filter.dateTo) params.append('dateTo', filter.dateTo)
        if (filter.page) params.append('page', filter.page.toString())
        if (filter.limit) params.append('limit', filter.limit.toString())
      }

      const queryString = params.toString()
      return await apiCall<ProductsResponse>(
        `/sales/products${queryString ? `?${queryString}` : ''}`
      )
    },
    [apiCall]
  )

  /**
   * Obtenir un produit par ID
   */
  const getProductById = useCallback(
    async (id: string): Promise<Product> => {
      const response = await apiCall<{ product: Product }>(`/sales/products/${id}`)
      return response.product
    },
    [apiCall]
  )

  /**
   * Mettre à jour un produit
   */
  const updateProduct = useCallback(
    async (id: string, updates: UpdateProductInput): Promise<Product> => {
      const response = await apiCall<UpdateProductResponse>(`/sales/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      return response.product
    },
    [apiCall]
  )

  /**
   * Supprimer un produit
   */
  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      await apiCall(`/sales/products/${id}`, {
        method: 'DELETE',
      })
    },
    [apiCall]
  )

  /**
   * Mettre en vente un produit
   */
  const listProduct = useCallback(
    async (id: string, input: ListProductInput): Promise<Product> => {
      const response = await apiCall<UpdateProductResponse>(
        `/sales/products/${id}/list`,
        {
          method: 'PUT',
          body: JSON.stringify(input),
        }
      )
      return response.product
    },
    [apiCall]
  )

  /**
   * Marquer un produit comme vendu
   */
  const sellProduct = useCallback(
    async (id: string, input: SellProductInput): Promise<Product> => {
      const response = await apiCall<UpdateProductResponse>(
        `/sales/products/${id}/sell`,
        {
          method: 'PUT',
          body: JSON.stringify(input),
        }
      )
      return response.product
    },
    [apiCall]
  )

  /**
   * Booster/débooster un produit
   */
  const toggleBoost = useCallback(
    async (id: string): Promise<Product> => {
      const response = await apiCall<UpdateProductResponse>(
        `/sales/products/${id}/boost`,
        {
          method: 'PUT',
        }
      )
      return response.product
    },
    [apiCall]
  )

  /**
   * Obtenir les statistiques de vente
   */
  const getSaleStats = useCallback(async (): Promise<SaleStats> => {
    const response = await apiCall<{ stats: SaleStats }>('/sales/stats')
    return response.stats
  }, [apiCall])

  /**
   * Obtenir les produits d'une commande fournisseur
   */
  const getProductsBySupplierOrder = useCallback(
    async (supplierOrderId: string): Promise<Product[]> => {
      const response = await apiCall<{ products: Product[] }>(
        `/sales/supplier-orders/${supplierOrderId}/products`
      )
      return response.products
    },
    [apiCall]
  )

  return {
    // État
    loading,
    error,

    // Méthodes CRUD
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,

    // Actions de vente
    listProduct,
    sellProduct,
    toggleBoost,

    // Statistiques
    getSaleStats,
    getProductsBySupplierOrder,
  }
}
