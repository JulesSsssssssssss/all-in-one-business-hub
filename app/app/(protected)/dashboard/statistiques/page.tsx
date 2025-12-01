'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart, Target, Calendar, ArrowUp, ArrowDown, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export default function StatistiquesPage() {
  const { getDashboardAnalytics, loading, error } = useAnalytics();
  const [analytics, setAnalytics] = useState<any>(null);
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

  const formatMonthName = (period: string) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const [year, month] = period.split('-');
    return months[parseInt(month) - 1];
  };

  if (loading && !analytics) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaki-7 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des statistiques...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-12 text-center">
            <p className="text-red-600 mb-4">Erreur : {error || 'Impossible de charger les statistiques'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculer les données pour les KPIs
  const totalRevenue = analytics.totalRevenue || 0;
  const totalProfit = analytics.totalProfit || 0;
  const averageMargin = analytics.averageMargin || 0;
  const totalSales = analytics.totalSales || 0;
  const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Préparer les données pour les graphiques
  const monthlyChartData = analytics.revenueByMonth?.map((stat: any) => ({
    month: formatMonthName(stat.period),
    revenue: stat.revenue,
    costs: stat.costs,
    profit: stat.profit,
    margin: stat.margin
  })) || [];

  const platformChartData = analytics.salesByPlatform?.map((platform: any) => ({
    name: platform.platform,
    value: platform.revenue,
    sales: platform.salesCount
  })) || [];

  const profitabilityData = analytics.profitabilityOverTime?.map((point: any) => ({
    date: new Date(point.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    profit: point.cumulativeProfit
  })) || [];

  // Couleurs pour les graphiques
  const COLORS = ['#8B7355', '#A0826D', '#6B9080', '#B4A7D6', '#E8B4B8', '#FFD6A5'];

  // Calcul des tendances
  const lastMonthRevenue = monthlyChartData.length >= 2 ? monthlyChartData[monthlyChartData.length - 1]?.revenue || 0 : 0;
  const previousMonthRevenue = monthlyChartData.length >= 2 ? monthlyChartData[monthlyChartData.length - 2]?.revenue || 0 : 0;
  const revenueTrend = previousMonthRevenue > 0 ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;

  const lastMonthProfit = monthlyChartData.length >= 2 ? monthlyChartData[monthlyChartData.length - 1]?.profit || 0 : 0;
  const previousMonthProfit = monthlyChartData.length >= 2 ? monthlyChartData[monthlyChartData.length - 2]?.profit || 0 : 0;
  const profitTrend = previousMonthProfit > 0 ? ((lastMonthProfit - previousMonthProfit) / previousMonthProfit) * 100 : 0;

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
                <p className="text-sm text-gray-600 font-medium">Total ventes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalSales}</p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueTrend >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueTrend).toFixed(1)}% vs mois dernier
                  </span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueTrend >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueTrend).toFixed(1)}% vs mois dernier
                  </span>
                </div>
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
                <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalProfit)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {profitTrend >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${profitTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(profitTrend).toFixed(1)}% vs mois dernier
                  </span>
                </div>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{averageMargin.toFixed(1)}%</p>
                <p className="text-xs text-gray-600 mt-1">Après impôts</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évolution mensuelle - Graphique en barres */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-kaki-7" />
            Évolution des revenus et profits (12 derniers mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenus" fill="#8B7355" radius={[8, 8, 0, 0]} />
                <Bar dataKey="costs" name="Coûts" fill="#E8B4B8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#6B9080" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      {/* Graphique courbe de rentabilité */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-5 w-5 text-kaki-7" />
            Évolution du profit cumulé (30 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profitabilityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={profitabilityData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B9080" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6B9080" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit cumulé"
                  stroke="#6B9080" 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par plateforme - Graphique en camembert */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <DollarSign className="h-5 w-5 text-kaki-7" />
              Répartition des ventes par plateforme
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platformChartData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  {platformChartData.map((platform: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                        <p className="text-xs text-gray-600">{platform.sales} ventes • {formatCurrency(platform.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        {/* Top Produits */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Package className="h-5 w-5 text-kaki-7" />
              Top 5 Produits les plus rentables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topProducts && analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-kaki-6 to-kaki-5 text-white rounded-full font-bold text-sm shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.platform || 'Non spécifié'} • Marge: {product.margin.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-green-600 font-medium">+{formatCurrency(product.profit)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-12">Aucun produit vendu</p>
              )}
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
