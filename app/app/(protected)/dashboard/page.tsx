'use client';

import { useState, useEffect } from "react";
import { TrendingUp, Package, ShoppingCart, DollarSign, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SalesStatsCards } from "@/components/dashboard/SalesStatsCards";
import { ProductsList } from "@/components/dashboard/ProductsList";
import { useSales, type Product } from "@/hooks/useSales";
import { useSupplierOrders, type SupplierOrder } from "@/hooks/useSupplierOrders";

export default function DashboardPage() {
  const [recentSales, setRecentSales] = useState<Product[]>([]);
  const [platformStats, setPlatformStats] = useState<Record<string, number>>({});
  const [pendingOrders, setPendingOrders] = useState<SupplierOrder[]>([]);
  const [statsToList, setStatsToList] = useState(0);
  
  const { getProducts } = useSales();
  const { getOrders } = useSupplierOrders();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger tous les produits
      const allProductsResponse = await getProducts({});
      const allProducts = allProductsResponse.products || [];
      
      console.log('Total products:', allProducts.length);

      // Filtrer les produits vendus (sold ou sold_euros)
      const soldProducts = allProducts.filter(p => 
        p.status === 'sold' || p.status === 'sold_euros'
      );
      
      console.log('Sold products:', soldProducts.length);

      // Dernières ventes (les 5 plus récentes)
      const sortedSales = soldProducts.sort((a, b) => {
        const dateA = new Date(a.saleDate || a.updatedAt || a.createdAt);
        const dateB = new Date(b.saleDate || b.updatedAt || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setRecentSales(sortedSales.slice(0, 5));

      // Calculer les stats par plateforme
      const platformCount: Record<string, number> = {};
      soldProducts.forEach(product => {
        if (product.platform) {
          platformCount[product.platform] = (platformCount[product.platform] || 0) + 1;
        }
      });
      
      console.log('Platform stats:', platformCount);
      setPlatformStats(platformCount);

      // Articles à lister
      const toList = allProducts.filter(p => p.status === 'to_list').length;
      setStatsToList(toList);

      // Commandes en cours
      const orders = await getOrders('active');
      setPendingOrders((Array.isArray(orders) ? orders : []).slice(0, 3));
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const platformColors: Record<string, string> = {
    'Vinted': 'bg-[#09B1BA]',
    'Leboncoin': 'bg-[#FF6E14]',
    'eBay': 'bg-[#E53238]',
    'Vestiaire Collective': 'bg-black',
  };

  const totalPlatformSales = Object.values(platformStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Grid - Vraies données depuis l'API */}
      <SalesStatsCards />

      {/* Commandes fournisseurs actives */}
      {pendingOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Commandes Fournisseurs en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent/50 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{order.name}</p>
                    <p className="text-sm text-muted-foreground">{order.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{formatCurrency(order.totalCost + order.shippingCost + order.customsCost + order.otherFees)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.purchaseDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance des ventes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              // Grouper par plateforme
              const platformRevenue: Record<string, { count: number; revenue: number; profit: number }> = {}
              
              recentSales.forEach(sale => {
                if (sale.platform && (sale.status === 'sold' || sale.status === 'sold_euros')) {
                  if (!platformRevenue[sale.platform]) {
                    platformRevenue[sale.platform] = { count: 0, revenue: 0, profit: 0 }
                  }
                  platformRevenue[sale.platform].count++
                  platformRevenue[sale.platform].revenue += (sale.soldPrice || 0)
                  platformRevenue[sale.platform].profit += ((sale.soldPrice || 0) - (sale.unitCost || 0))
                }
              })
              
              const totalRevenue = Object.values(platformRevenue).reduce((sum, p) => sum + p.revenue, 0)
              const sortedPlatforms = Object.entries(platformRevenue).sort(([, a], [, b]) => b.revenue - a.revenue)
              
              return (
                <div className="space-y-6">
                  {/* Total */}
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Revenus totaux</p>
                        <p className="text-3xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <DollarSign className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Liste des plateformes */}
                  <div className="space-y-3">
                    {sortedPlatforms.length > 0 ? (
                      sortedPlatforms.map(([platform, data]) => {
                        const percentage = totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
                        const avgPerSale = data.count > 0 ? data.revenue / data.count : 0
                        
                        return (
                          <div key={platform} className="p-4 rounded-xl border border-border bg-accent/30 hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={cn("h-3 w-3 rounded-full", platformColors[platform] || 'bg-primary')} />
                                <span className="font-semibold text-foreground">{platform}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {data.count} ventes
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">{formatCurrency(data.revenue)}</p>
                                <p className="text-xs text-muted-foreground">
                                  Moy: {formatCurrency(avgPerSale)}
                                </p>
                              </div>
                            </div>
                            
                            {/* Barre de progression */}
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={cn("h-full transition-all duration-500", platformColors[platform] || 'bg-primary')}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <span className="text-muted-foreground">{percentage.toFixed(1)}% du total</span>
                              <span className={cn("font-semibold", data.profit >= 0 ? 'text-green-600' : 'text-red-600')}>
                                Profit: {formatCurrency(data.profit)}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">Aucune vente enregistrée</p>
                    )}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>

        {/* Dernières ventes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Dernières ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div
                    key={sale._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground line-clamp-1">{sale.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {sale.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(sale.saleDate || sale.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-green-600">{formatCurrency(sale.soldPrice || 0)}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.soldPrice && sale.unitCost ? (
                          <span className="flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            +{formatCurrency(sale.soldPrice - sale.unitCost)}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">Aucune vente récente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles à lister */}
      {statsToList > 0 && (
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{statsToList} articles à publier</p>
                  <p className="text-sm text-muted-foreground">Augmentez vos ventes en publiant ces articles</p>
                </div>
              </div>
              <a href="/dashboard/ventes">
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer">
                  Voir les articles
                </Badge>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
