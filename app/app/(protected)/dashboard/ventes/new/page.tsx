'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, DollarSign, Image as ImageIcon, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSales } from '@/hooks/useSales';
import { useSupplierOrders } from '@/hooks/useSupplierOrders';
import { useAuth } from '@/hooks/useAuth';
import type { CreateProductInput, ProductStatus } from '@/types/sale';

const PRODUCT_STATUSES: { value: ProductStatus; label: string; color: string }[] = [
  { value: 'in_delivery', label: 'En cours de livraison', color: 'bg-gray-500' },
  { value: 'to_list', label: 'À faire', color: 'bg-gray-500' },
  { value: 'in_progress', label: 'En cours', color: 'bg-blue-500' },
  { value: 'listed', label: 'À mettre en vente', color: 'bg-yellow-500' },
  { value: 'for_sale', label: 'En vente', color: 'bg-blue-500' },
  { value: 'sold', label: 'ACHAT', color: 'bg-purple-500' },
  { value: 'problem', label: 'Problème', color: 'bg-red-500' },
  { value: 'sold_euros', label: 'Vendu €€€', color: 'bg-green-500' },
];

// Taux de charges sociales
const CHARGES_WITHOUT_ACRE = 0.22; // 22% sans ACRE
const CHARGES_WITH_ACRE = 0.11; // 11% avec ACRE (réduction 50%)

export default function NewSalePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierOrderIdFromUrl = searchParams.get('orderId');
  
  const { user } = useAuth();
  const { createProduct, loading: createLoading } = useSales();
  const { getOrders, loading: ordersLoading } = useSupplierOrders();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    supplierOrderId: supplierOrderIdFromUrl || '',
    name: '', // Description
    brand: '', // Marque
    size: '', // Taille
    quantity: 1,
    description: '',
    photos: [] as string[],
    url: '', // URL plateforme
    unitCost: '', // Prix achat unitaire
    purchaseDate: new Date().toISOString().split('T')[0], // Date achat
    salePrice: '', // Prix de vente prévu
    soldPrice: '', // Vendu à combien
    soldDate: '', // Date vente
    status: 'sold_euros' as ProductStatus,
    condition: '',
    platform: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculs automatiques
  const totalCost = useMemo(() => {
    const unitCostNum = parseFloat(String(formData.unitCost).replace(',', '.')) || 0;
    return formData.quantity * unitCostNum;
  }, [formData.quantity, formData.unitCost]);

  const profitCalculations = useMemo(() => {
    const soldPrice = parseFloat(String(formData.soldPrice).replace(',', '.') || '0');
    if (!soldPrice || soldPrice === 0) {
      return { withoutAcre: 0, withAcre: 0, margin: 0 };
    }

    // Bénéfice brut
    const grossProfit = soldPrice - totalCost;

    // Charges sociales sans ACRE
    const chargesWithoutAcre = soldPrice * CHARGES_WITHOUT_ACRE;
    const profitWithoutAcre = grossProfit - chargesWithoutAcre;

    // Charges sociales avec ACRE
    const chargesWithAcre = soldPrice * CHARGES_WITH_ACRE;
    const profitWithAcre = grossProfit - chargesWithAcre;

    // Marge
    const margin = (grossProfit / soldPrice) * 100;

    return {
      withoutAcre: profitWithoutAcre,
      withAcre: profitWithAcre,
      margin: margin,
    };
  }, [formData.soldPrice, totalCost]);

  useEffect(() => {
    loadOrders();
  }, []);

  // Charger la date d'achat de la commande sélectionnée
  useEffect(() => {
    if (formData.supplierOrderId && orders.length > 0) {
      const order = orders.find((o) => o._id === formData.supplierOrderId);
      if (order && order.purchaseDate) {
        const orderDate = new Date(order.purchaseDate).toISOString().split('T')[0];
        setFormData((prev) => ({ ...prev, purchaseDate: orderDate }));
      }
    }
  }, [formData.supplierOrderId, orders]);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierOrderId) newErrors.supplierOrderId = 'Commande fournisseur requise';
    if (!formData.name) newErrors.name = 'Description requise';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantité doit être > 0';
    
    const unitCostNum = parseFloat(String(formData.unitCost).replace(',', '.'));
    if (!formData.unitCost || isNaN(unitCostNum) || unitCostNum <= 0) {
      newErrors.unitCost = 'Prix d\'achat doit être > 0';
    }
    
    const salePriceNum = parseFloat(String(formData.salePrice).replace(',', '.'));
    if (!formData.salePrice || isNaN(salePriceNum) || salePriceNum <= 0) {
      newErrors.salePrice = 'Prix de vente prévu doit être > 0';
    }
    
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Date d\'achat requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Préparer les données avec conversion des prix
      const unitCostNum = parseFloat(String(formData.unitCost).replace(',', '.'));
      const salePriceNum = formData.salePrice ? parseFloat(String(formData.salePrice).replace(',', '.')) : 0;
      const soldPriceNum = formData.soldPrice ? parseFloat(String(formData.soldPrice).replace(',', '.')) : undefined;
      
      const productData: CreateProductInput = {
        supplierOrderId: formData.supplierOrderId,
        name: formData.name,
        brand: formData.brand || undefined,
        size: formData.size || undefined,
        quantity: formData.quantity,
        description: formData.description || undefined,
        photos: formData.photos.filter(Boolean),
        url: formData.url || undefined,
        unitCost: unitCostNum,
        totalCost,
        purchaseDate: formData.purchaseDate,
        salePrice: salePriceNum,
        soldPrice: soldPriceNum,
        soldDate: formData.soldDate || undefined,
        status: formData.status,
        condition: formData.condition || undefined,
        platform: formData.platform || undefined,
      };

      console.log('📤 Données envoyées:', productData);
      const product = await createProduct(productData);
      
      // Rediriger vers la page de la commande ou la liste des ventes
      if (supplierOrderIdFromUrl) {
        router.push(`/dashboard/commandes/${supplierOrderIdFromUrl}`);
      } else {
        router.push('/dashboard/ventes');
      }
    } catch (err) {
      console.error('Erreur création vente:', err);
      setErrors({ submit: 'Erreur lors de la création de la vente' });
    }
  };

  const selectedOrder = orders?.find((o) => o._id === formData.supplierOrderId);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <Link href={supplierOrderIdFromUrl ? `/dashboard/commandes/${supplierOrderIdFromUrl}` : '/dashboard/ventes'}>
          <Button variant="ghost" className="mb-4 text-gray-700 hover:text-kaki-7">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle Vente</h1>
        <p className="text-gray-600 mt-1">Enregistrer une nouvelle vente pour le suivi de rentabilité</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Commande fournisseur */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Package className="h-5 w-5 text-kaki-7" />
                  Commande fournisseur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="supplierOrderId">Commande fournisseur *</Label>
                  <Select
                    value={formData.supplierOrderId}
                    onValueChange={(value) => handleChange('supplierOrderId', value)}
                    disabled={!!supplierOrderIdFromUrl || ordersLoading}
                  >
                    <SelectTrigger className={errors.supplierOrderId ? 'border-red-500' : ''}>
                      <SelectValue placeholder={ordersLoading ? "Chargement..." : "Sélectionner une commande"} />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order._id} value={order._id}>
                          {order.supplier} - {new Date(order.purchaseDate).toLocaleDateString()} - {order.totalCost.toFixed(2)}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplierOrderId && (
                    <p className="text-sm text-red-500 mt-1">{errors.supplierOrderId}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations article */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Package className="h-5 w-5 text-kaki-7" />
                  Informations de l'article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Description *</Label>
                  <Textarea
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Description de l'article"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marque</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                      placeholder="Nike, Adidas, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="size">Taille</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => handleChange('size', e.target.value)}
                      placeholder="M, L, 42, etc."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantité *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <Label htmlFor="condition">État</Label>
                  <Input
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => handleChange('condition', e.target.value)}
                    placeholder="Neuf, Très bon état, Bon état, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prix et finances */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <DollarSign className="h-5 w-5 text-kaki-7" />
                  Prix et finances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitCost">Prix d'achat unitaire *</Label>
                    <Input
                      id="unitCost"
                      type="text"
                      value={formData.unitCost}
                      onChange={(e) => handleChange('unitCost', e.target.value)}
                      placeholder="10.50 ou 10,50"
                      className={errors.unitCost ? 'border-red-500' : ''}
                    />
                    {errors.unitCost && <p className="text-sm text-red-500 mt-1">{errors.unitCost}</p>}
                  </div>

                  <div>
                    <Label htmlFor="totalCost">Prix total</Label>
                    <Input
                      id="totalCost"
                      type="number"
                      value={totalCost.toFixed(2)}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Calculé automatiquement</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchaseDate">Date d'achat *</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleChange('purchaseDate', e.target.value)}
                      className={errors.purchaseDate ? 'border-red-500' : ''}
                    />
                    {errors.purchaseDate && <p className="text-sm text-red-500 mt-1">{errors.purchaseDate}</p>}
                    {selectedOrder && (
                      <p className="text-xs text-gray-500 mt-1">
                        Date de la commande fournisseur
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="salePrice">
                      Prix de vente prévu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="salePrice"
                      type="text"
                      value={formData.salePrice}
                      onChange={(e) => handleChange('salePrice', e.target.value)}
                      placeholder="15.00 ou 15,00"
                      className={errors.salePrice ? 'border-red-500' : ''}
                    />
                    {errors.salePrice && (
                      <p className="text-sm text-red-500 mt-1">{errors.salePrice}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vente */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-kaki-7" />
                  Informations de vente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">État de la commande *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value as ProductStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.color}`} />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="soldPrice">Vendu à combien</Label>
                    <Input
                      id="soldPrice"
                      type="text"
                      value={formData.soldPrice}
                      onChange={(e) => handleChange('soldPrice', e.target.value)}
                      placeholder="20.00 ou 20,00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="soldDate">Date de vente</Label>
                    <Input
                      id="soldDate"
                      type="date"
                      value={formData.soldDate}
                      onChange={(e) => handleChange('soldDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform">Plateforme</Label>
                    <Input
                      id="platform"
                      value={formData.platform}
                      onChange={(e) => handleChange('platform', e.target.value)}
                      placeholder="Vinted, Leboncoin, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="url">URL de vente</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleChange('url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <ImageIcon className="h-5 w-5 text-kaki-7" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>URLs des photos</Label>
                  <p className="text-sm text-gray-500 mb-2">Ajouter des URLs de photos séparées par des virgules</p>
                  <Textarea
                    value={formData.photos.join(', ')}
                    onChange={(e) => handleChange('photos', e.target.value.split(',').map(url => url.trim()))}
                    placeholder="https://photo1.jpg, https://photo2.jpg"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral - Résumé */}
          <div className="space-y-6">
            {/* Calcul de bénéfice */}
            <Card className="bg-gradient-to-br from-kaki-1 to-kaki-2 border-kaki-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="h-5 w-5 text-kaki-7" />
                  Calcul de rentabilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix total achat</span>
                    <span className="font-semibold text-gray-900">{totalCost.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix de vente</span>
                    <span className="font-semibold text-gray-900">
                      {formData.soldPrice ? parseFloat(formData.soldPrice).toFixed(2) : '0.00'}€
                    </span>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Bénéfice sans ACRE</span>
                      <span className={`font-bold ${profitCalculations.withoutAcre >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitCalculations.withoutAcre.toFixed(2)}€
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Charges sociales: 22%</p>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Bénéfice avec ACRE</span>
                      <span className={`font-bold ${profitCalculations.withAcre >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitCalculations.withAcre.toFixed(2)}€
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Charges sociales: 11% (réduction 50%)</p>
                  </div>

                  {formData.soldPrice && parseFloat(formData.soldPrice) > 0 && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Marge brute</span>
                        <span className="font-bold text-kaki-7">
                          {profitCalculations.margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {user?.hasAcre && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-medium">
                      ℹ️ Vous bénéficiez de l'ACRE
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Réduction de 50% sur vos charges sociales
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-kaki-7 hover:bg-kaki-8 text-white"
                  disabled={createLoading}
                >
                  {createLoading ? 'Création...' : 'Créer la vente'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>

                {errors.submit && (
                  <p className="text-sm text-red-500 text-center">{errors.submit}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
