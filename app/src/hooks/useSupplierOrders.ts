import { useState, useCallback } from 'react'

const API_BASE_URL = '/api'

/**
 * Types pour les commandes fournisseurs
 */
export interface SupplierOrder {
  _id: string
  userId: string
  name: string
  supplier: string
  purchaseDate: string
  totalCost: number
  shippingCost: number
  customsCost: number
  otherFees: number
  notes?: string
  status: 'active' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface CreateSupplierOrderInput {
  name: string
  supplier: string
  purchaseDate: string | Date
  totalCost: number
  shippingCost?: number
  customsCost?: number
  otherFees?: number
  notes?: string
}

export interface UpdateSupplierOrderInput {
  name?: string
  supplier?: string
  purchaseDate?: string | Date
  totalCost?: number
  shippingCost?: number
  customsCost?: number
  otherFees?: number
  notes?: string
  status?: 'active' | 'completed'
}

/**
 * Hook pour gérer les commandes fournisseurs
 */
export function useSupplierOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fonction helper pour les appels API
   */
  const apiCall = useCallback(async <T,>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setLoading(true)
    setError(null)

    try {
      // Better Auth utilise les cookies automatiquement
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
   * Créer une commande fournisseur
   */
  const createOrder = useCallback(
    async (input: CreateSupplierOrderInput): Promise<SupplierOrder> => {
      const response = await apiCall<{ order: SupplierOrder }>('/supplier-orders', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      return response.order
    },
    [apiCall]
  )

  /**
   * Obtenir toutes les commandes
   */
  const getOrders = useCallback(
    async (status?: 'active' | 'completed'): Promise<SupplierOrder[]> => {
      const queryString = status ? `?status=${status}` : ''
      const response = await apiCall<{ orders: SupplierOrder[] }>(
        `/supplier-orders${queryString}`
      )
      return response.orders
    },
    [apiCall]
  )

  /**
   * Obtenir une commande par ID
   */
  const getOrderById = useCallback(
    async (id: string): Promise<SupplierOrder> => {
      const response = await apiCall<{ order: SupplierOrder }>(`/supplier-orders/${id}`)
      return response.order
    },
    [apiCall]
  )

  /**
   * Mettre à jour une commande
   */
  const updateOrder = useCallback(
    async (id: string, updates: UpdateSupplierOrderInput): Promise<SupplierOrder> => {
      const response = await apiCall<{ order: SupplierOrder }>(
        `/supplier-orders/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates),
        }
      )
      return response.order
    },
    [apiCall]
  )

  /**
   * Supprimer une commande
   */
  const deleteOrder = useCallback(
    async (id: string): Promise<void> => {
      await apiCall(`/supplier-orders/${id}`, {
        method: 'DELETE',
      })
    },
    [apiCall]
  )

  /**
   * Marquer une commande comme complétée
   */
  const completeOrder = useCallback(
    async (id: string): Promise<SupplierOrder> => {
      const response = await apiCall<{ order: SupplierOrder }>(
        `/supplier-orders/${id}/complete`,
        {
          method: 'PUT',
        }
      )
      return response.order
    },
    [apiCall]
  )

  return {
    // État
    loading,
    error,

    // Méthodes
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    completeOrder,
  }
}
