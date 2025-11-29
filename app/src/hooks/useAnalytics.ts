import { useState, useCallback } from 'react'
import type { DashboardAnalytics } from '@/types/analytics'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * Hook pour gérer les analytics
 */
export function useAnalytics() {
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
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
   * Obtenir les analytics du dashboard
   */
  const getDashboardAnalytics = useCallback(
    async (hasAcre: boolean = false): Promise<DashboardAnalytics> => {
      const response = await apiCall<{ analytics: DashboardAnalytics }>(
        `/analytics/dashboard?hasAcre=${hasAcre}`
      )
      return response.analytics
    },
    [apiCall]
  )

  return {
    loading,
    error,
    getDashboardAnalytics,
  }
}
