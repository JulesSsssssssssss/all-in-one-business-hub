'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TopProduct } from '@/types/analytics';
import { TrendingUp } from 'lucide-react';

interface TopProductsListProps {
  products: TopProduct[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Top 5 produits les plus rentables
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune vente pour le moment
            </p>
          ) : (
            products.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {product.brand && (
                      <span className="text-xs text-gray-600">{product.brand}</span>
                    )}
                    {product.platform && (
                      <Badge variant="outline" className="text-xs">
                        {product.platform}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(product.soldDate)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">CA</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Bénéfice</p>
                  <p className="font-bold text-green-600">{formatCurrency(product.profit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Marge</p>
                  <p className={`font-semibold ${product.margin >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                    {product.margin.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
