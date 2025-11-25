'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, Package, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplierOrders, type CreateSupplierOrderInput } from '@/hooks/useSupplierOrders';

export default function NewCommandePage() {
  const router = useRouter();
  const { createOrder, loading } = useSupplierOrders();
  const [formData, setFormData] = useState<CreateSupplierOrderInput>({
    name: '',
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    totalCost: 0,
    shippingCost: 0,
    customsCost: 0,
    otherFees: 0,
    notes: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Cost') || name.includes('Fees') ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Appel API pour créer la commande
      await createOrder(formData);
      
      // Redirection vers la page des commandes
      router.push('/dashboard/commandes');
    } catch (error) {
      console.error('Error creating order:', error);
      setSubmitError(error instanceof Error ? error.message : 'Erreur lors de la création de la commande');
    }
  };

  const getTotalCost = () => {
    return formData.totalCost + formData.shippingCost + formData.customsCost + formData.otherFees;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/commandes">
          <Button variant="ghost" className="mb-4 text-gray-700 hover:text-kaki-7">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle Commande Fournisseur</h1>
        <p className="text-gray-600 mt-1">Enregistrez un nouvel achat auprès d'un fournisseur</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Package className="h-5 w-5 text-kaki-7" />
              Informations de base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-900">Nom de la commande *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Lot Nike - Alibaba Mars 2025"
                className="mt-1 bg-white border-gray-300 focus:border-kaki-6"
              />
              <p className="text-sm text-gray-500 mt-1">Donnez un nom descriptif à votre commande</p>
            </div>

            <div>
              <Label htmlFor="supplier" className="text-gray-900">Fournisseur *</Label>
              <Input
                id="supplier"
                name="supplier"
                type="text"
                required
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Ex: Alibaba Express, Vide Grenier Paris..."
                className="mt-1 bg-white border-gray-300 focus:border-kaki-6"
              />
            </div>

            <div>
              <Label htmlFor="purchaseDate" className="text-gray-900">Date d'achat *</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="pl-10 bg-white border-gray-300 focus:border-kaki-6"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coûts */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <DollarSign className="h-5 w-5 text-kaki-7" />
              Coûts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="totalCost" className="text-gray-900">Coût d'achat *</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <Input
                  id="totalCost"
                  name="totalCost"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.totalCost || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="pl-8 bg-white border-gray-300 focus:border-kaki-6"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Montant payé au fournisseur</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shippingCost" className="text-gray-900">Livraison</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <Input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shippingCost || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-8 bg-white border-gray-300 focus:border-kaki-6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customsCost" className="text-gray-900">Douanes</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <Input
                    id="customsCost"
                    name="customsCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.customsCost || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-8 bg-white border-gray-300 focus:border-kaki-6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="otherFees" className="text-gray-900">Autres frais</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <Input
                    id="otherFees"
                    name="otherFees"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.otherFees || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-8 bg-white border-gray-300 focus:border-kaki-6"
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Coût total</span>
                <span className="text-2xl font-bold text-kaki-7">{formatCurrency(getTotalCost())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Notes (optionnel)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Ajoutez des notes sur cette commande (nombre d'articles, détails, etc.)"
              className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20 transition resize-none"
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {submitError && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-red-600">{submitError}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/dashboard/commandes" className="flex-1">
            <Button type="button" variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-kaki-7 text-white"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Création...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Créer la commande
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
