'use client';

import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatistiquesPage() {
  // Données mock pour les graphiques
  const monthlyStats = [
    { month: 'Jan', revenue: 2400, cost: 1500, profit: 900 },
    { month: 'Fév', revenue: 3200, cost: 2100, profit: 1100 },
    { month: 'Mar', revenue: 4100, cost: 2800, profit: 1300 },
    { month: 'Avr', revenue: 3800, cost: 2500, profit: 1300 },
    { month: 'Mai', revenue: 5200, cost: 3200, profit: 2000 },
    { month: 'Juin', revenue: 6100, cost: 3800, profit: 2300 },
  ];

  const topProducts = [
    { name: 'Nike Air Max 90', sold: 15, revenue: 1200, profit: 450 },
    { name: 'Adidas Superstar', sold: 12, revenue: 960, profit: 380 },
    { name: 'Vintage Levi\'s 501', sold: 10, revenue: 800, profit: 520 },
    { name: 'Nike Hoodie', sold: 8, revenue: 400, profit: 160 },
    { name: 'Accessoires Mode', sold: 25, revenue: 625, profit: 400 },
  ];

  const platformStats = [
    { platform: 'Vinted', sales: 45, revenue: 2800, percentage: 40 },
    { platform: 'Leboncoin', sales: 30, revenue: 2100, percentage: 30 },
    { platform: 'eBay', sales: 20, revenue: 1400, percentage: 20 },
    { platform: 'Autres', sales: 10, revenue: 700, percentage: 10 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistiques & Analytics</h1>
        <p className="text-gray-600 mt-1">Analysez vos performances et optimisez votre stratégie</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Taux de conversion</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">68%</p>
                <p className="text-xs text-green-600 mt-1">+5% ce mois</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Marge moyenne</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">57%</p>
                <p className="text-xs text-green-600 mt-1">+3% ce mois</p>
              </div>
              <div className="h-12 w-12 bg-kaki-2 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-kaki-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Délai moyen vente</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12j</p>
                <p className="text-xs text-green-600 mt-1">-2j ce mois</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Panier moyen</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">68€</p>
                <p className="text-xs text-green-600 mt-1">+8€ ce mois</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évolution mensuelle */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-kaki-7" />
            Évolution mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => {
              const profitPercentage = (stat.profit / stat.revenue) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{stat.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">Coût: {formatCurrency(stat.cost)}</span>
                      <span className="text-gray-600">Revenu: {formatCurrency(stat.revenue)}</span>
                      <span className="font-bold text-green-600">Profit: {formatCurrency(stat.profit)}</span>
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-red-200 transition-all"
                      style={{ width: `${(stat.cost / stat.revenue) * 100}%` }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-kaki-6 to-kaki-5 transition-all flex items-center justify-end pr-3"
                      style={{ width: `${(stat.profit / stat.revenue) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{profitPercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produits */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Package className="h-5 w-5 text-kaki-7" />
              Top 5 Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-kaki-6 text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sold} vendus</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-green-600">+{formatCurrency(product.profit)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition par plateforme */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <DollarSign className="h-5 w-5 text-kaki-7" />
              Répartition par plateforme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformStats.map((platform, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{platform.platform}</span>
                      <span className="text-sm text-gray-600">{platform.sales} ventes</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{formatCurrency(platform.revenue)}</span>
                      <span className="text-sm text-gray-600 ml-2">({platform.percentage}%)</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-kaki-6 to-kaki-5 transition-all"
                      style={{ width: `${platform.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-blue-900 mb-2">📊 Données en temps réel</h3>
          <p className="text-sm text-blue-800">
            Ces statistiques sont mises à jour automatiquement en fonction de vos ventes et achats. 
            Utilisez ces données pour optimiser vos prix, identifier vos meilleurs produits et choisir les meilleures plateformes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
