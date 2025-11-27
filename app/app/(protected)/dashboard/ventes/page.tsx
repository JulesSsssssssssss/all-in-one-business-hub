'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Search, 
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Plus,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSales } from '@/hooks/useSales';
import { useSupplierOrders } from '@/hooks/useSupplierOrders';
import type { Product } from '@/types/sale';

export default function VentesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  
  const { getProducts, deleteProduct, loading: productsLoading } = useSales();
  const { getOrders, loading: ordersLoading } = useSupplierOrders();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Paramètre utilisateur pour l'ACRE (à récupérer depuis l'API)
  const userHasAcre = true; // TODO: Récupérer depuis le profil utilisateur

  useEffect(() => {
    loadData();
  }, [statusFilter, orderFilter, dateFrom, dateTo]);

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        getProducts({
          status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
          supplierOrderId: orderFilter !== 'all' ? orderFilter : undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }),
        getOrders()
      ]);
      
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) return;
    
    try {
      await deleteProduct(productId);
      await loadData(); // Recharger la liste
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // Gestion des checkboxes
  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const toggleAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProducts.size} article(s) ?`)) return;
    
    try {
      await Promise.all(Array.from(selectedProducts).map(id => deleteProduct(id)));
      setSelectedProducts(new Set());
      await loadData();
    } catch (err) {
      console.error('Erreur suppression groupée:', err);
      alert('Erreur lors de la suppression groupée');
    }
  };

  const handleBulkExport = () => {
    if (selectedProducts.size === 0) return;
    
    const selectedData = filteredProducts.filter(p => selectedProducts.has(p._id));
    const csv = [
      ['Nom', 'Marque', 'Taille', 'Quantité', 'Prix achat', 'Prix vente', 'Statut', 'Date'].join(','),
      ...selectedData.map(p => [
        p.name,
        p.brand || '',
        p.size || '',
        p.quantity,
        p.unitCost,
        p.soldPrice || p.salePrice || 0,
        p.status,
        p.soldDate ? formatDate(p.soldDate) : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calcul des bénéfices et impôts (basé sur le paramètre utilisateur)
  const calculateProfits = (product: Product) => {
    const saleAmount = product.soldPrice || product.salePrice || 0;
    const totalCost = product.totalCost || (product.quantity * product.unitCost);
    const grossProfit = saleAmount - totalCost;
    
    // Taux de charges sociales : 11% avec ACRE, 22% sans ACRE
    const taxRate = userHasAcre ? 0.11 : 0.22;
    const taxes = saleAmount * taxRate;
    const netProfit = grossProfit - taxes;
    
    return {
      grossProfit,
      taxes,
      netProfit,
    };
  };

  // Stats globales calculées depuis les vraies données
  const soldProducts = products.filter(p => p.status === 'sold' || p.status === 'sold_euros');
  const listedProducts = products.filter(p => p.status === 'for_sale' || p.status === 'listed');
  const inStockProducts = products.filter(p => p.status === 'to_list' || p.status === 'in_delivery' || p.status === 'in_progress');
  
  const stats = {
    totalSales: soldProducts.length,
    totalRevenue: soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0),
    totalCosts: soldProducts.reduce((sum, p) => sum + (p.totalCost || (p.quantity * p.unitCost)), 0),
    totalTaxes: soldProducts.reduce((sum, p) => sum + calculateProfits(p).taxes, 0),
    totalProfit: soldProducts.reduce((sum, p) => sum + calculateProfits(p).netProfit, 0),
    inStock: inStockProducts.length,
    listed: listedProducts.length,
    problemCount: products.filter(p => p.status === 'problem').length,
  };

  // Filtre des produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_delivery: { label: 'En livraison', className: 'bg-gray-100 text-gray-700 border-gray-300' },
      to_list: { label: 'À faire', className: 'bg-gray-100 text-gray-700 border-gray-300' },
      in_progress: { label: 'En cours', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      listed: { label: 'À mettre en vente', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      for_sale: { label: 'En vente', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      sold: { label: 'ACHAT', className: 'bg-purple-100 text-purple-700 border-purple-300' },
      problem: { label: 'Problème', className: 'bg-red-100 text-red-700 border-red-300' },
      sold_euros: { label: 'Vendu €€€', className: 'bg-green-100 text-green-700 border-green-300' },
      in_stock: { label: 'En stock', className: 'bg-gray-100 text-gray-700 border-gray-300' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock;
    return <Badge className={`${config.className} border text-xs`}>{config.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventes & Articles</h1>
          <p className="text-gray-600 mt-1">Gérez vos ventes avec calcul automatique de rentabilité</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300 text-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          <Link href="/dashboard/ventes/new">
            <Button className="bg-primary hover:bg-kaki-7 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une vente
            </Button>
          </Link>
        </div>
      </div>

      {/* Indicateur de période */}
      {(dateFrom || dateTo) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">
                  Période filtrée :
                  {dateFrom && dateTo ? (
                    <> du {formatDate(dateFrom)} au {formatDate(dateTo)}</>
                  ) : dateFrom ? (
                    <> à partir du {formatDate(dateFrom)}</>
                  ) : (
                    <> jusqu'au {formatDate(dateTo)}</>
                  )}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700 font-medium">Ventes totales</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{stats.totalSales}</p>
            <p className="text-xs text-blue-600 mt-1">articles vendus{(dateFrom || dateTo) ? ' (période)' : ''}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <p className="text-xs text-green-700 font-medium">Chiffre d'affaires</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-green-600 mt-1">Total des ventes{(dateFrom || dateTo) ? ' (période)' : ''}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-kaki-1 to-kaki-2 border-kaki-3">
          <CardContent className="p-4">
            <p className="text-xs text-kaki-7 font-medium">Bénéfice net</p>
            <p className={`text-3xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(stats.totalProfit)}
            </p>
            <p className="text-xs text-kaki-6 mt-1">
              Marge: {stats.totalRevenue > 0 ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : '0'}% {userHasAcre ? '(ACRE)' : ''}{(dateFrom || dateTo) ? ' (période)' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statut ACRE */}
      <Card className={`border-2 ${userHasAcre ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {userHasAcre ? (
                <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <X className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">
                  {userHasAcre ? '✅ ACRE Active' : '⚠️ ACRE Inactive'}
                </p>
                <p className="text-sm text-gray-700">
                  Taux d'imposition appliqué : <span className="font-bold">{userHasAcre ? '6.6%' : '13.2%'}</span>
                </p>
              </div>
            </div>
            <Link href="/dashboard/parametres">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1 ml-1">Date début</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1 ml-1">Date fin</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>
              {(dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="self-end text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20"
            >
              <option value="all">Toutes les commandes</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
                className={statusFilter === 'all' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                Tous
              </Button>
              <Button
                variant={statusFilter === 'in_stock' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('in_stock')}
                size="sm"
                className={statusFilter === 'in_stock' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                En stock
              </Button>
              <Button
                variant={statusFilter === 'listed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('listed')}
                size="sm"
                className={statusFilter === 'listed' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                En ligne
              </Button>
              <Button
                variant={statusFilter === 'sold' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('sold')}
                size="sm"
                className={statusFilter === 'sold' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                Vendus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre d'actions groupées */}
      {selectedProducts.size > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-blue-900">
                  {selectedProducts.size} article(s) sélectionné(s)
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProducts(new Set())}
                  className="text-blue-700 hover:text-blue-900"
                >
                  Désélectionner tout
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter ({selectedProducts.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer ({selectedProducts.size})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Articles ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAllProducts}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Nom Article</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Taille</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Qté</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Prix Achat</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date Achat</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date Vente</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">État</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Boost</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Vendu à (€)</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Bénéf Brut</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Bénéf Net</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Impôts</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Commande</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const profits = calculateProfits(product);
                  const productId = product._id || (product as any).id;
                  
                  return (
                    <tr key={productId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(productId)}
                          onChange={() => toggleProductSelection(productId)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                            {getStatusBadge(product.status)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{product.size || '-'}</td>
                      <td className="py-4 px-4 text-center text-sm font-semibold text-gray-900">{product.quantity}</td>
                      <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">{formatCurrency(product.unitCost)}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{formatDate(product.purchaseDate)}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{product.soldDate ? formatDate(product.soldDate) : '-'}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{product.condition || '-'}</td>
                      <td className="py-4 px-4 text-center">
                        {product.boosted ? (
                          <span className="text-orange-600 font-bold text-lg">🚀</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {product.soldPrice ? (
                          <span className="font-bold text-lg text-green-600">{formatCurrency(product.soldPrice)}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {profits.grossProfit >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-semibold text-sm ${profits.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(profits.grossProfit)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {profits.netProfit >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-bold text-sm ${profits.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(profits.netProfit)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold text-red-600">{formatCurrency(profits.taxes)}</span>
                          <span className="text-xs text-gray-500">{userHasAcre ? '6.6%' : '13.2%'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/dashboard/commandes/${typeof product.supplierOrderId === 'object' ? (product.supplierOrderId as any)._id : product.supplierOrderId}`}>
                          <Badge className="bg-kaki-2 text-kaki-7 border-kaki-4 hover:bg-kaki-3 cursor-pointer text-xs">
                            Voir commande
                          </Badge>
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-kaki-7"
                            onClick={() => handleViewProduct(product)}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/ventes/${product._id}/edit`}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-blue-600"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteProduct(product._id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {productsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kaki-7 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des ventes...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune vente trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Commencez par enregistrer vos premières ventes'}
              </p>
              <Link href="/dashboard/ventes/new">
                <Button className="bg-primary hover:bg-kaki-7 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter ma première vente
                </Button>
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Légende */}
      <Card className="bg-kaki-1 border-kaki-3">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-3">💡 Comment ça fonctionne ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">Vendu à (€)</p>
              <p className="text-xs">Le montant en euros auquel vous avez vendu l'article</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Bénéfice Brut</p>
              <p className="text-xs">Prix de vente - Prix d'achat</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Impôts</p>
              <p className="text-xs">Calculés automatiquement selon votre statut ACRE (6.6% ou 13.2%)</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Bénéfice Net</p>
              <p className="text-xs">Ce qu'il vous reste après impôts</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-kaki-3">
            💡 Les impôts sont calculés en fonction de votre paramètre ACRE. L'ACRE est valable 1 an à partir de sa date de début.
          </p>
        </CardContent>
      </Card>

      {/* Modale de visualisation */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Détails de la vente</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setViewingProduct(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="font-medium">{viewingProduct.name}</p>
                  </div>
                  {viewingProduct.brand && (
                    <div>
                      <p className="text-xs text-gray-500">Marque</p>
                      <p className="font-medium">{viewingProduct.brand}</p>
                    </div>
                  )}
                  {viewingProduct.size && (
                    <div>
                      <p className="text-xs text-gray-500">Taille</p>
                      <p className="font-medium">{viewingProduct.size}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Quantité</p>
                    <p className="font-medium">{viewingProduct.quantity}</p>
                  </div>
                  {viewingProduct.condition && (
                    <div>
                      <p className="text-xs text-gray-500">État</p>
                      <p className="font-medium">{viewingProduct.condition}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    {getStatusBadge(viewingProduct.status)}
                  </div>
                </div>
              </div>

              {/* Finances */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Finances</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Prix achat unitaire</p>
                    <p className="font-medium">{formatCurrency(viewingProduct.unitCost)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prix total achat</p>
                    <p className="font-medium">{formatCurrency(viewingProduct.totalCost || (viewingProduct.quantity * viewingProduct.unitCost))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date d'achat</p>
                    <p className="font-medium">{formatDate(viewingProduct.purchaseDate)}</p>
                  </div>
                  {viewingProduct.soldPrice && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Vendu à</p>
                        <p className="font-medium text-green-600">{formatCurrency(viewingProduct.soldPrice)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date de vente</p>
                        <p className="font-medium">{viewingProduct.soldDate ? formatDate(viewingProduct.soldDate) : '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bénéfice net</p>
                        <p className="font-medium text-green-600">{formatCurrency(calculateProfits(viewingProduct).netProfit)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Plateforme */}
              {(viewingProduct.platform || viewingProduct.url) && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Plateforme de vente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingProduct.platform && (
                      <div>
                        <p className="text-xs text-gray-500">Plateforme</p>
                        <p className="font-medium">{viewingProduct.platform}</p>
                      </div>
                    )}
                    {viewingProduct.url && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">URL</p>
                        <a href={viewingProduct.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                          {viewingProduct.url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Photos */}
              {(() => {
                const photos = Array.isArray(viewingProduct.photos) 
                  ? viewingProduct.photos 
                  : typeof viewingProduct.photos === 'string' 
                    ? JSON.parse(viewingProduct.photos || '[]')
                    : [];
                
                return photos.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Photos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((photo: string, idx: number) => (
                        <img 
                          key={idx} 
                          src={photo} 
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Link href={`/dashboard/ventes/${viewingProduct._id}/edit`} className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleDeleteProduct(viewingProduct._id);
                    setViewingProduct(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
