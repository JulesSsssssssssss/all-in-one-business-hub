'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Package, TrendingUp, Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SupplierOrder, Product } from '@/types/order';

// Mock data - à remplacer par des vraies données
const mockOrder: SupplierOrder & { products: Product[] } = {
  id: '1',
  userId: 1,
  name: 'Lot Nike - Alibaba Mars 2025',
  supplier: 'Alibaba Express',
  purchaseDate: '2025-03-15',
  totalCost: 1500,
  shippingCost: 150,
  customsCost: 80,
  otherFees: 20,
  notes: 'Lot de 50 articles Nike variés : baskets, vêtements, accessoires',
  status: 'active',
  createdAt: '2025-03-15',
  updatedAt: '2025-03-15',
  products: [
    {
      id: 'p1',
      userId: 1,
      supplierOrderId: '1',
      name: 'Nike Air Max 90',
      description: 'Baskets Nike Air Max 90 blanches, taille 42',
      photos: [],
      unitCost: 35,
      salePrice: 80,
      soldPrice: 75,
      status: 'sold',
      platform: 'Vinted',
      listedDate: '2025-03-16',
      soldDate: '2025-03-18',
      createdAt: '2025-03-15',
      updatedAt: '2025-03-18',
    },
    {
      id: 'p2',
      userId: 1,
      supplierOrderId: '1',
      name: 'Nike Hoodie',
      description: 'Sweat à capuche Nike noir, taille M',
      photos: [],
      unitCost: 35,
      salePrice: 50,
      status: 'listed',
      platform: 'Leboncoin',
      listedDate: '2025-03-17',
      createdAt: '2025-03-15',
      updatedAt: '2025-03-17',
    },
    {
      id: 'p3',
      userId: 1,
      supplierOrderId: '1',
      name: 'Nike Cap',
      description: 'Casquette Nike bleu marine',
      photos: [],
      unitCost: 35,
      salePrice: 25,
      status: 'in_stock',
      createdAt: '2025-03-15',
      updatedAt: '2025-03-15',
    },
  ],
};

export default function CommandeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order] = useState(mockOrder);

  const getTotalCost = () => {
    return order.totalCost + order.shippingCost + order.customsCost + order.otherFees;
  };

  const getStats = () => {
    const products = order.products || [];
    const totalItems = products.length;
    const itemsSold = products.filter(p => p.status === 'sold').length;
    const itemsListed = products.filter(p => p.status === 'listed').length;
    const itemsInStock = products.filter(p => p.status === 'in_stock').length;
    const totalRevenue = products
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    const projectedRevenue = totalRevenue + products
      .filter(p => p.status !== 'sold')
      .reduce((sum, p) => sum + p.salePrice, 0);
    const currentProfit = totalRevenue - getTotalCost();
    const projectedProfit = projectedRevenue - getTotalCost();
    const breakEvenPoint = (totalRevenue / getTotalCost()) * 100;
    
    return {
      totalItems,
      itemsSold,
      itemsListed,
      itemsInStock,
      totalRevenue,
      projectedRevenue,
      currentProfit,
      projectedProfit,
      breakEvenPoint: Math.min(breakEvenPoint, 100),
    };
  };

  const stats = getStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sold: { label: 'Vendu', className: 'bg-green-100 text-green-700 border-green-300' },
      listed: { label: 'En ligne', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      in_stock: { label: 'En stock', className: 'bg-gray-100 text-gray-700 border-gray-300' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock;
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  const getProfitabilityStatus = () => {
    if (stats.breakEvenPoint >= 100) return { label: 'Rentable', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (stats.breakEvenPoint >= 50) return { label: 'En cours', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { label: 'Non rentable', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const profitabilityStatus = getProfitabilityStatus();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/commandes">
          <Button variant="ghost" className="mb-4 text-gray-700 hover:text-kaki-7">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{order.name}</h1>
              <Badge
                variant={order.status === 'active' ? 'default' : 'secondary'}
                className={order.status === 'active' ? 'bg-kaki-6 text-white' : 'bg-gray-200 text-gray-700'}
              >
                {order.status === 'active' ? 'Active' : 'Terminée'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
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
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium">Coût Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(getTotalCost())}</p>
            <p className="text-xs text-gray-500 mt-1">Investi</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium">Revenus Actuels</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.itemsSold} articles vendus</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium">Profit Actuel</p>
            <p className={`text-2xl font-bold mt-2 ${stats.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.currentProfit)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.breakEvenPoint.toFixed(0)}% récupéré</p>
          </CardContent>
        </Card>

        <Card className={`${profitabilityStatus.bgColor} border-gray-200`}>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium">Statut</p>
            <p className={`text-2xl font-bold mt-2 ${profitabilityStatus.color}`}>
              {profitabilityStatus.label}
            </p>
            <p className="text-xs text-gray-600 mt-1">Projection: {formatCurrency(stats.projectedProfit)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression vers rentabilité</span>
            <span className="text-sm font-bold text-gray-900">{stats.breakEvenPoint.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stats.breakEvenPoint >= 100 ? 'bg-green-500' :
                stats.breakEvenPoint >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(stats.breakEvenPoint, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>0€</span>
            <span>{formatCurrency(getTotalCost())}</span>
          </div>
        </CardContent>
      </Card>

      {/* Détails des coûts */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <DollarSign className="h-5 w-5 text-kaki-7" />
            Détail des coûts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Achat</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.totalCost)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Livraison</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.shippingCost)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Douanes</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.customsCost)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Autres</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.otherFees)}</p>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Package className="h-5 w-5 text-kaki-7" />
              Articles ({stats.totalItems})
            </CardTitle>
            <Button className="bg-primary hover:bg-kaki-7 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.products && order.products.length > 0 ? (
              order.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-kaki-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(product.status)}
                        {product.platform && (
                          <span className="text-xs text-gray-500">{product.platform}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-600">Coût</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(product.unitCost)}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-600">Prix vente</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(product.soldPrice || product.salePrice)}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-600">Marge</p>
                    <p className={`font-semibold ${
                      (product.soldPrice || product.salePrice) - product.unitCost >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency((product.soldPrice || product.salePrice) - product.unitCost)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucun article dans cette commande</p>
                <Button className="bg-primary hover:bg-kaki-7 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le premier article
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
