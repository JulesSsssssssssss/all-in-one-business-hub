'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Package, DollarSign, Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { OrderProfitability } from '@/types/order';

export default function RentabilitePage() {
  // Données mock - à remplacer par des vraies données
  const mockProfitability: OrderProfitability[] = [
    {
      orderId: '1',
      orderName: 'Lot Nike - Alibaba Mars 2025',
      supplier: 'Alibaba Express',
      purchaseDate: '2025-03-15',
      totalCost: 1750, // 1500 + 150 + 80 + 20
      totalItems: 50,
      itemsSold: 12,
      itemsInStock: 30,
      itemsListed: 8,
      totalRevenue: 890,
      currentProfit: -860,
      profitMargin: -49.14,
      breakEvenPoint: 50.86,
      projectedRevenue: 3200,
      projectedProfit: 1450,
      status: 'in_progress',
    },
    {
      orderId: '2',
      orderName: 'Vêtements Vintage - Vide Grenier',
      supplier: 'Vide Grenier Paris 18',
      purchaseDate: '2025-03-10',
      totalCost: 250,
      totalItems: 15,
      itemsSold: 8,
      itemsInStock: 5,
      itemsListed: 2,
      totalRevenue: 420,
      currentProfit: 170,
      profitMargin: 68.0,
      breakEvenPoint: 100,
      projectedRevenue: 680,
      projectedProfit: 430,
      status: 'profitable',
    },
    {
      orderId: '3',
      orderName: 'Lot Adidas - DHgate',
      supplier: 'DHgate Supplier',
      purchaseDate: '2025-02-20',
      totalCost: 960, // 800 + 100 + 50 + 10
      totalItems: 30,
      itemsSold: 30,
      itemsInStock: 0,
      itemsListed: 0,
      totalRevenue: 1850,
      currentProfit: 890,
      profitMargin: 92.71,
      breakEvenPoint: 100,
      projectedRevenue: 1850,
      projectedProfit: 890,
      status: 'profitable',
    },
    {
      orderId: '4',
      orderName: 'Accessoires Mode - AliExpress',
      supplier: 'AliExpress',
      purchaseDate: '2025-03-20',
      totalCost: 480,
      totalItems: 40,
      itemsSold: 5,
      itemsInStock: 30,
      itemsListed: 5,
      totalRevenue: 150,
      currentProfit: -330,
      profitMargin: -68.75,
      breakEvenPoint: 31.25,
      projectedRevenue: 980,
      projectedProfit: 500,
      status: 'not_profitable',
    },
  ];

  // Stats globales
  const globalStats = {
    totalOrders: mockProfitability.length,
    profitableOrders: mockProfitability.filter(o => o.status === 'profitable').length,
    totalInvested: mockProfitability.reduce((sum, o) => sum + o.totalCost, 0),
    totalRevenue: mockProfitability.reduce((sum, o) => sum + o.totalRevenue, 0),
    totalProfit: mockProfitability.reduce((sum, o) => sum + o.currentProfit, 0),
    projectedProfit: mockProfitability.reduce((sum, o) => sum + o.projectedProfit, 0),
  };

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'profitable':
        return {
          label: '✅ Rentable',
          className: 'bg-green-100 text-green-700 border-green-300',
          color: 'bg-green-500',
        };
      case 'in_progress':
        return {
          label: '🟡 En cours',
          className: 'bg-orange-100 text-orange-700 border-orange-300',
          color: 'bg-orange-500',
        };
      case 'not_profitable':
        return {
          label: '🔴 Non rentable',
          className: 'bg-red-100 text-red-700 border-red-300',
          color: 'bg-red-500',
        };
      default:
        return {
          label: 'Inconnu',
          className: 'bg-gray-100 text-gray-700 border-gray-300',
          color: 'bg-gray-500',
        };
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rentabilité par Commande</h1>
        <p className="text-gray-600 mt-1">Suivez la performance de chaque commande fournisseur</p>
      </div>

      {/* Stats Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Investi</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(globalStats.totalInvested)}</p>
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
                <p className="text-sm text-gray-600 font-medium">Revenus Actuels</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(globalStats.totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Profit Actuel</p>
                <p className={`text-2xl font-bold mt-2 ${globalStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(globalStats.totalProfit)}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                globalStats.totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {globalStats.totalProfit >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Commandes Rentables</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {globalStats.profitableOrders}/{globalStats.totalOrders}
                </p>
              </div>
              <div className="h-12 w-12 bg-kaki-2 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-kaki-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projection */}
      <Card className="bg-gradient-to-r from-kaki-6 to-kaki-5 border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-kaki-1 text-sm font-medium mb-1">Profit Prévisionnel</p>
              <p className="text-3xl font-bold">{formatCurrency(globalStats.projectedProfit)}</p>
              <p className="text-kaki-1 text-sm mt-1">Si tous les articles restants se vendent</p>
            </div>
            <ArrowUpRight className="h-12 w-12 text-white opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Tableau de rentabilité */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Vue détaillée par commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProfitability.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              
              return (
                <div
                  key={order.orderId}
                  className="border border-gray-200 rounded-lg p-6 hover:border-kaki-6 hover:shadow-lg transition-all"
                >
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{order.orderName}</h3>
                        <Badge className={`${statusConfig.className} border`}>
                          {statusConfig.label}
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
                    </div>
                    <Link href={`/dashboard/commandes/${order.orderId}`}>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">Coût Total</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Revenus</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(order.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Profit Actuel</p>
                      <p className={`text-lg font-bold ${order.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(order.currentProfit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Marge</p>
                      <p className={`text-lg font-bold ${order.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {order.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progression */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Progression vers rentabilité</span>
                      <span className="font-bold text-gray-900">{order.breakEvenPoint.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${statusConfig.color}`}
                        style={{ width: `${Math.min(order.breakEvenPoint, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Total: </span>
                        <span className="font-semibold text-gray-900">{order.totalItems} articles</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Vendus: </span>
                        <span className="font-semibold text-green-600">{order.itemsSold}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">En ligne: </span>
                        <span className="font-semibold text-blue-600">{order.itemsListed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">En stock: </span>
                        <span className="font-semibold text-gray-600">{order.itemsInStock}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Projection</p>
                      <p className="text-sm font-bold text-kaki-7">{formatCurrency(order.projectedProfit)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Aide */}
      <Card className="bg-kaki-1 border-kaki-3">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-2">💡 Comment lire ces données ?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>✅ Rentable</strong> : Vous avez déjà récupéré 100% de votre investissement</li>
            <li>• <strong>🟡 En cours</strong> : Vous avez récupéré entre 50% et 99% de votre investissement</li>
            <li>• <strong>🔴 Non rentable</strong> : Vous avez récupéré moins de 50% de votre investissement</li>
            <li>• <strong>Profit Prévisionnel</strong> : Ce que vous gagnerez si tous les articles restants se vendent au prix affiché</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
