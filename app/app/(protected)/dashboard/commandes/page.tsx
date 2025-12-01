'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Package, TrendingUp, TrendingDown, DollarSign, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSupplierOrders, type SupplierOrder } from '@/hooks/useSupplierOrders';
import { useSales } from '@/hooks/useSales';

export default function CommandesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [ordersProfitability, setOrdersProfitability] = useState<Record<string, { totalRevenue: number; totalProfit: number; profitMargin: number }>>({});
  
  const { getOrders, loading, error } = useSupplierOrders();
  const { getProducts } = useSales();

  // Charger les commandes au montage du composant
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const data = await getOrders(filter);
      setOrders(Array.isArray(data) ? data : []);
      
      // Charger la rentabilité pour chaque commande
      await loadProfitability(data);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
      setOrders([]);
    }
  };

  const loadProfitability = async (ordersList: SupplierOrder[]) => {
    try {
      const profitabilityData: Record<string, { totalRevenue: number; totalProfit: number; profitMargin: number }> = {};
      
      for (const order of ordersList) {
        const salesResponse = await getProducts({ supplierOrderId: order._id });
        const sales = salesResponse.products || [];
        
        // Calculer le revenu total des ventes réelles (produits vendus)
        const totalRevenue = sales
          .filter(sale => sale.status === 'sold' || sale.status === 'sold_euros')
          .reduce((sum, sale) => sum + (sale.soldPrice || 0), 0);
        
        const totalCost = getTotalCost(order);
        const totalProfit = totalRevenue - totalCost;
        
        // Calculer le break-even point (pourcentage du coût récupéré)
        const breakEvenPoint = totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0;
        
        profitabilityData[order._id] = {
          totalRevenue,
          totalProfit,
          profitMargin: Math.max(0, Math.min(100, breakEvenPoint))
        };
      }
      
      setOrdersProfitability(profitabilityData);
    } catch (err) {
      console.error('Erreur chargement rentabilité:', err);
    }
  };

  // Stats calculées depuis les vraies données
  const stats = {
    totalOrders: orders?.length || 0,
    activeOrders: orders?.filter(o => o.status === 'active').length || 0,
    totalInvested: orders?.reduce((sum, o) => sum + o.totalCost + o.shippingCost + o.customsCost + o.otherFees, 0) || 0,
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTotalCost = (order: SupplierOrder) => {
    return order.totalCost + order.shippingCost + order.customsCost + order.otherFees;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes Fournisseurs</h1>
          <p className="text-gray-600 mt-1">Gérez vos achats et suivez leur rentabilité</p>
        </div>
        <Link href="/dashboard/commandes/new">
          <Button className="bg-primary hover:bg-kaki-7 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Commande
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Commandes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-kaki-2 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-kaki-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Commandes Actives</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeOrders}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Investi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalInvested)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-white border-gray-300"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={`h-12 px-6 text-base ${statusFilter === 'all' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}`}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                className={`h-12 px-6 text-base ${statusFilter === 'active' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}`}
              >
                Actives
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                className={`h-12 px-6 text-base ${statusFilter === 'completed' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}`}
              >
                Terminées
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {loading && orders.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaki-7 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des commandes...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-12 text-center">
              <p className="text-red-600 mb-4">Erreur : {error}</p>
              <Button onClick={loadOrders} variant="outline">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Commencez par créer votre première commande fournisseur'}
              </p>
              <Link href="/dashboard/commandes/new">
                <Button className="bg-primary hover:bg-kaki-7 text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer une commande
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Link key={order._id} href={`/dashboard/commandes/${order._id}`}>
              <Card className="bg-white border-gray-200 hover:border-kaki-6 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{order.name}</h3>
                        <Badge
                          variant={order.status === 'active' ? 'default' : 'secondary'}
                          className={order.status === 'active' ? 'bg-kaki-6 text-white' : 'bg-gray-200 text-gray-700'}
                        >
                          {order.status === 'active' ? 'Active' : 'Terminée'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{order.supplier}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.purchaseDate)}</span>
                        </div>
                      </div>
                      {order.notes && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-1">{order.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalCost(order))}</p>
                      <p className="text-sm text-gray-600 mt-1">Coût total</p>
                    </div>
                  </div>

                  {/* Profitability Progress Bar */}
                  {ordersProfitability[order._id] && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Rentabilité</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${ordersProfitability[order._id].totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(ordersProfitability[order._id].totalProfit)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({ordersProfitability[order._id].profitMargin.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ordersProfitability[order._id].profitMargin >= 50 ? 'bg-green-500' :
                            ordersProfitability[order._id].profitMargin >= 25 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, ordersProfitability[order._id].profitMargin))}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Investi: {formatCurrency(getTotalCost(order))}</span>
                        <span>Revenus: {formatCurrency(ordersProfitability[order._id].totalRevenue)}</span>
                      </div>
                    </div>
                  )}

                  {/* Cost Breakdown */}
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Achat</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Livraison</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.shippingCost)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Douanes</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.customsCost)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Autres</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.otherFees)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
