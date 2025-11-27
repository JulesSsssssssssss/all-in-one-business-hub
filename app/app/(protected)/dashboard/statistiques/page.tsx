'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { PlatformChart } from '@/components/dashboard/PlatformChart';
import { TopProductsList } from '@/components/dashboard/TopProductsList';
import { ProfitabilityChart } from '@/components/dashboard/ProfitabilityChart';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { DashboardAnalytics } from '@/types/analytics';

export default function StatistiquesPage() {
  const { getDashboardAnalytics, loading } = useAnalytics();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const userHasAcre = true; // TODO: Récupérer depuis le profil utilisateur

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getDashboardAnalytics(userHasAcre);
      setAnalytics(data);
    } catch (err) {
      console.error('Erreur chargement analytics:', err);
    }
  };

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
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des statistiques...</p>
          </CardContent>
        </Card>
      ) : analytics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Ventes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalSales}</p>
                    <p className="text-xs text-green-600 mt-1">Articles vendus</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Chiffre d'affaires</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(analytics.totalRevenue)}</p>
                    <p className="text-xs text-green-600 mt-1">Total</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Bénéfice net</p>
                    <p className={`text-3xl font-bold mt-2 ${analytics.totalProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                      {formatCurrency(analytics.totalProfit)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{userHasAcre ? 'Avec ACRE' : 'Sans ACRE'}</p>
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
                    <p className="text-sm text-gray-600 font-medium">Marge moyenne</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.averageMargin.toFixed(1)}%</p>
                    <p className="text-xs text-green-600 mt-1">Sur toutes ventes</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {/* Graphiques */}
      {analytics && (
        <>
          {/* Graphiques CA par mois et semaine */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RevenueChart 
              data={analytics.revenueByMonth} 
              title="CA par mois (12 derniers mois)"
              periodType="month"
            />
            <RevenueChart 
              data={analytics.revenueByWeek} 
              title="CA par semaine (12 dernières semaines)"
              periodType="week"
            />
          </div>

          {/* Courbe de rentabilité */}
          <ProfitabilityChart data={analytics.profitabilityOverTime} />

          {/* Top 5 produits */}
          <TopProductsList products={analytics.topProducts} />

          {/* Ventes par plateforme */}
          <PlatformChart data={analytics.salesByPlatform} />
        </>
      )}

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
