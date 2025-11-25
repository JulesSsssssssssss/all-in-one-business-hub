'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Package, TrendingUp, TrendingDown, DollarSign, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { SupplierOrder } from '@/types/order';

export default function CommandesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Données mock - à remplacer par des vraies données
  const mockOrders: SupplierOrder[] = [
    {
      id: '1',
      userId: 1,
      name: 'Lot Nike - Alibaba Mars 2025',
      supplier: 'Alibaba Express',
      purchaseDate: '2025-03-15',
      totalCost: 1500,
      shippingCost: 150,
      customsCost: 80,
      otherFees: 20,
      notes: 'Lot de 50 articles Nike',
      status: 'active',
      createdAt: '2025-03-15',
      updatedAt: '2025-03-15',
    },
    {
      id: '2',
      userId: 1,
      name: 'Vêtements Vintage - Vide Grenier',
      supplier: 'Vide Grenier Paris 18',
      purchaseDate: '2025-03-10',
      totalCost: 250,
      shippingCost: 0,
      customsCost: 0,
      otherFees: 0,
      status: 'active',
      createdAt: '2025-03-10',
      updatedAt: '2025-03-10',
    },
    {
      id: '3',
      userId: 1,
      name: 'Lot Adidas - DHgate',
      supplier: 'DHgate Supplier',
      purchaseDate: '2025-02-20',
      totalCost: 800,
      shippingCost: 100,
      customsCost: 50,
      otherFees: 10,
      status: 'completed',
      createdAt: '2025-02-20',
      updatedAt: '2025-03-01',
    },
  ];

  // Stats calculées
  const stats = {
    totalOrders: mockOrders.length,
    activeOrders: mockOrders.filter(o => o.status === 'active').length,
    totalInvested: mockOrders.reduce((sum, o) => sum + o.totalCost + o.shippingCost + o.customsCost + o.otherFees, 0),
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                Actives
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                className={statusFilter === 'completed' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                Terminées
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
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
            <Link key={order.id} href={`/dashboard/commandes/${order.id}`}>
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
