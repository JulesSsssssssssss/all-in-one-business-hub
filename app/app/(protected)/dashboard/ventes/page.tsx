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
import type { Product } from '@/types/sale';

export default function VentesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock_euros' | 'listed' | 'sold_euros'>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  
  const { getProducts, loading, error } = useSales();
  
  // Paramètre utilisateur pour l'ACRE (à récupérer depuis l'API)
  const userHasAcre = true; // TODO: Récupérer depuis le profil utilisateur

  // Charger les produits au montage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(Array.isArray(response.products) ? response.products : []);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setProducts([]);
      }
    };
    loadProducts();
  }, [getProducts]);

  // Calcul des bénéfices et impôts (basé sur le paramètre utilisateur)
  const calculateProfits = (product: Product) => {
    const saleAmount = product.soldPrice || product.salePrice;
    const cost = product.totalCost || (product.unitCost * product.quantity);
    const grossProfit = saleAmount - cost;
    
    // Taux d'imposition : 11% avec ACRE, 22% sans ACRE
    const taxRate = userHasAcre ? 0.11 : 0.22;
    const taxes = saleAmount * taxRate;
    const netProfit = grossProfit - taxes;
    
    return {
      grossProfit,
      taxes,
      netProfit,
    };
  };

  // Stats globales
  const stats = {
    totalSales: products.filter(p => p.status === 'sold_euros').length,
    totalRevenue: products.filter(p => p.status === 'sold_euros').reduce((sum: number, p: any) => sum + (p.soldPrice || 0), 0),
    totalProfit: products.filter(p => p.status === 'sold_euros').reduce((sum: number, p: any) => sum + calculateProfits(p).netProfit, 0),
    inStock: products.filter(p => p.status === 'in_stock_euros').length,
    listed: products.filter(p => p.status === 'listed').length,
  };

  // Filtre des produits (liste unique des IDs de commandes)
  const uniqueOrderIds = Array.from(new Set(products.map(p => p.supplierOrderId))).filter(Boolean);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesOrder = orderFilter === 'all' || product.supplierOrderId === orderFilter;
    return matchesSearch && matchesStatus && matchesOrder;
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
      sold_euros: { label: 'Vendu', className: 'bg-green-100 text-green-700 border-green-300' },
      listed: { label: 'En ligne', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      in_stock_euros: { label: 'En stock', className: 'bg-gray-100 text-gray-700 border-gray-300' },
      in_delivery: { label: 'En livraison', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      to_list: { label: 'À mettre en ligne', className: 'bg-purple-100 text-purple-700 border-purple-300' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock_euros;
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600 font-medium">Ventes totales</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSales}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600 font-medium">Chiffre d'affaires</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600 font-medium">Bénéfice net</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.totalProfit)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600 font-medium">En ligne</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.listed}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600 font-medium">En stock</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{stats.inStock}</p>
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
            
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20"
            >
              <option value="all">Toutes les commandes</option>
              {uniqueOrderIds.map((orderId) => (
                <option key={orderId} value={orderId}>
                  Commande {orderId}
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
                variant={statusFilter === 'in_stock_euros' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('in_stock_euros')}
                size="sm"
                className={statusFilter === 'in_stock_euros' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
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
                variant={statusFilter === 'sold_euros' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('sold_euros')}
                size="sm"
                className={statusFilter === 'sold_euros' ? 'bg-primary hover:bg-kaki-7' : 'border-gray-300'}
              >
                Vendus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Articles ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Chargement des produits...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Erreur : {error}</p>
            </div>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun produit trouvé</p>
            </div>
          )}
          {!loading && !error && filteredProducts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
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
                  
                  return (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                        {product.soldTo ? (
                          <span className="font-bold text-lg text-green-600">{product.soldTo}€</span>
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
                        <Link href={`/dashboard/commandes/${product.supplierOrderId}`}>
                          <Badge className="bg-kaki-2 text-kaki-7 border-kaki-4 hover:bg-kaki-3 cursor-pointer text-xs">
                            Commande {product.supplierOrderId.substring(0, 8)}
                          </Badge>
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-kaki-7">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
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
          )}
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
    </div>
  );
}
