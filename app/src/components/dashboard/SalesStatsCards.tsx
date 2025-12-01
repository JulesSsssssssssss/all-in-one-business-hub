'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSales } from '@/hooks/useSales'
import type { Product } from '@/types/sale'

interface Stats {
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
 * Composant affichant les statistiques de vente
 */
export function SalesStatsCards() {
  const { getProducts, loading, error } = useSales()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Charger tous les produits
      const response = await getProducts({})
      const products = response.products || []
      
      console.log('Stats - Total products:', products.length)

      // Calculer les statistiques
      const inStockProducts = products.filter(p => 
        p.status === 'in_stock' || 
        p.status === 'in_stock_euros' || 
        p.status === 'to_list' ||
        p.status === 'in_delivery'
      )
      
      const listedProducts = products.filter(p => 
        p.status === 'listed' || 
        p.status === 'for_sale'
      )
      
      const soldProducts = products.filter(p => 
        p.status === 'sold' || 
        p.status === 'sold_euros'
      )

      console.log('Stats - Sold products:', soldProducts.length)

      // Calculer les revenus et coûts
      const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0)
      const totalCost = soldProducts.reduce((sum, p) => sum + (p.unitCost || 0), 0)
      const totalProfit = totalRevenue - totalCost

      // Calculer la marge moyenne (uniquement sur les produits vendus avec un coût)
      const profitableProducts = soldProducts.filter(p => p.soldPrice && p.unitCost)
      const averageMargin = profitableProducts.length > 0
        ? profitableProducts.reduce((sum, p) => {
            const margin = ((p.soldPrice! - p.unitCost) / p.soldPrice!) * 100
            return sum + margin
          }, 0) / profitableProducts.length
        : 0

      console.log('Stats calculated:', {
        totalRevenue,
        totalCost,
        totalProfit,
        averageMargin
      })

      setStats({
        totalProducts: products.length,
        inStock: inStockProducts.length,
        listed: listedProducts.length,
        sold: soldProducts.length,
        totalRevenue,
        totalCost,
        totalProfit,
        averageMargin: Math.max(0, averageMargin)
      })
    } catch (err) {
      console.error('Erreur chargement stats:', err)
    }
  }

  if (loading && !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chargement...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">Erreur : {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Produits */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-blue-600">{stats.inStock} en stock</span>
            {' · '}
            <span className="text-orange-600">{stats.listed} en vente</span>
            {' · '}
            <span className="text-green-600">{stats.sold} vendus</span>
          </p>
        </CardContent>
      </Card>

      {/* Revenu Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenu Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Sur {stats.sold} vente{stats.sold > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Profit Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Profit Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalProfit)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Coût: {formatCurrency(stats.totalCost)}
          </p>
        </CardContent>
      </Card>

      {/* Marge Moyenne */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Marge Moyenne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.averageMargin >= 30 ? 'text-green-600' : stats.averageMargin >= 15 ? 'text-orange-600' : 'text-red-600'}`}>
            {formatPercent(stats.averageMargin)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.averageMargin >= 30 ? 'Excellente' : stats.averageMargin >= 15 ? 'Correcte' : 'Faible'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
