'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSales } from '@/hooks/useSales'
import type { Product, ProductFilter, ProductStatus } from '@/types/sale'

interface ProductsListProps {
  filter?: ProductFilter
  title?: string
}

/**
 * Composant affichant une liste de produits
 */
export function ProductsList({ filter, title = 'Produits' }: ProductsListProps) {
  const { getProducts, loading, error } = useSales()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadProducts()
  }, [filter])

  const loadProducts = async () => {
    try {
      const response = await getProducts(filter)
      setProducts(response.products)
      setTotal(response.total)
    } catch (err) {
      console.error('Erreur chargement produits:', err)
    }
  }

  const getStatusBadge = (status: ProductStatus) => {
    const variants: Record<ProductStatus, { label: string; className: string }> = {
      in_delivery: { label: 'En livraison', className: 'bg-gray-100 text-gray-800' },
      to_list: { label: 'À lister', className: 'bg-gray-100 text-gray-800' },
      in_progress: { label: 'En cours', className: 'bg-blue-100 text-blue-800' },
      listed: { label: 'Listé', className: 'bg-yellow-100 text-yellow-800' },
      for_sale: { label: 'En vente', className: 'bg-blue-100 text-blue-800' },
      sold: { label: 'Vendu', className: 'bg-green-100 text-green-800' },
      problem: { label: 'Problème', className: 'bg-red-100 text-red-800' },
      sold_euros: { label: 'Vendu €€€', className: 'bg-green-100 text-green-800' },
      in_stock: { label: 'En stock', className: 'bg-blue-100 text-blue-800' },
      in_stock_euros: { label: 'En stock €€€', className: 'bg-blue-100 text-blue-800' },
    }
    const variant = variants[status] || variants.in_stock
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading && products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {total} produit{total > 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun produit trouvé
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    {product.size && (
                      <Badge variant="outline" className="text-xs">
                        {product.size}
                      </Badge>
                    )}
                    {product.boosted && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        🚀 Boosté
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {getStatusBadge(product.status)}
                    {product.platform && (
                      <span className="text-xs">{product.platform}</span>
                    )}
                    <span className="text-xs">
                      Acheté le {formatDate(product.purchaseDate)}
                    </span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  {product.status === 'sold' && product.soldPrice ? (
                    <>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(product.soldPrice)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Profit: {formatCurrency(product.soldPrice - product.unitCost)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">
                        {formatCurrency(product.salePrice)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Coût: {formatCurrency(product.unitCost)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {total > products.length && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              // TODO: Implémenter la pagination
            }}
          >
            Voir plus ({total - products.length} restants)
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
