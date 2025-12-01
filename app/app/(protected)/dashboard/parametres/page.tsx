'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/lib/auth-client';
import { Settings, Check, X, Calendar, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function ParametresPage() {
  const { data: session } = useSession();
  const [hasAcre, setHasAcre] = useState(false);
  const [acreStartDate, setAcreStartDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Charger les paramètres utilisateur
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/user-settings');
        if (response.ok) {
          const data = await response.json();
          setHasAcre(data.hasAcre || false);
          setAcreStartDate(data.acreStartDate ? new Date(data.acreStartDate).toISOString().split('T')[0] : '');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Calculer si l'ACRE est encore valide (1 an)
  const isAcreValid = () => {
    if (!hasAcre || !acreStartDate) return false;
    const startDate = new Date(acreStartDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    return new Date() < endDate;
  };

  const acreEndDate = acreStartDate ? (() => {
    const date = new Date(acreStartDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  })() : '';

  // Sauvegarder les paramètres
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hasAcre,
          acreStartDate: acreStartDate || null,
        }),
      });

      if (response.ok) {
        toast.success('Paramètres enregistrés avec succès !', {
          description: 'Vos préférences fiscales ont été sauvegardées dans la base de données.',
          duration: 3000,
        });
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
        // Recharger la page après 1.5 secondes pour actualiser les calculs
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await response.json();
        toast.error('Erreur lors de la sauvegarde', {
          description: error.error || 'Une erreur est survenue',
        });
        setMessage({ type: 'error', text: error.error || 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion', {
        description: 'Impossible de contacter le serveur',
      });
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des paramètres' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Settings className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-1">Gérez vos préférences et votre profil fiscal</p>
        </div>
      </div>

      {/* Message de succès/erreur */}
      {message && (
        <Alert className={message.type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}>
          <AlertDescription className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Profil utilisateur */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Informations du profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Nom</Label>
            <Input 
              value={session?.user?.name || ''} 
              disabled 
              className="bg-muted border-border"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <Input 
              value={session?.user?.email || ''} 
              disabled 
              className="bg-muted border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration ACRE */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Configuration fiscale - ACRE</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            L'ACRE (Aide à la Création ou à la Reprise d'une Entreprise) réduit vos cotisations sociales pendant 1 an.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statut ACRE */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/50 border-2 border-border">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hasAcre ? 'bg-green-500' : 'bg-orange-500'}`}>
              {hasAcre ? (
                <Check className="h-7 w-7 text-white" />
              ) : (
                <X className="h-7 w-7 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-lg">
                {hasAcre ? '✅ ACRE Active' : '⚠️ ACRE Inactive'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Taux d'imposition appliqué : <span className="font-bold text-foreground">{hasAcre ? '7%' : '13%'}</span>
              </p>
              {hasAcre && acreStartDate && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Valide jusqu'au : <span className="font-semibold text-foreground">{acreEndDate}</span>
                  </span>
                  {isAcreValid() ? (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Expirée</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Toggle ACRE */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Bénéficiez-vous de l'ACRE ?</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={hasAcre ? 'default' : 'outline'}
                onClick={() => setHasAcre(true)}
                className={hasAcre ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-border text-muted-foreground'}
              >
                <Check className="h-4 w-4 mr-2" />
                Oui, j'ai l'ACRE
              </Button>
              <Button
                type="button"
                variant={!hasAcre ? 'default' : 'outline'}
                onClick={() => setHasAcre(false)}
                className={!hasAcre ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-border text-muted-foreground'}
              >
                <X className="h-4 w-4 mr-2" />
                Non, je n'ai pas l'ACRE
              </Button>
            </div>
          </div>

          {/* Date de début ACRE */}
          {hasAcre && (
            <div className="space-y-2">
              <Label htmlFor="acreStartDate" className="text-foreground font-semibold">
                Date de début de l'ACRE
              </Label>
              <Input
                id="acreStartDate"
                type="date"
                value={acreStartDate}
                onChange={(e) => setAcreStartDate(e.target.value)}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-2 mt-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  L'ACRE est valable pendant 1 an à partir de cette date. Après cette période, le taux d'imposition standard de 22% sera appliqué.
                </span>
              </p>
            </div>
          )}

          {/* Informations complémentaires */}
          <Alert className="bg-blue-50 border-blue-300 text-blue-900">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-2">ℹ️ À propos de l'ACRE</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Taux d'imposition réduit à 7% au lieu de 13%</li>
                <li>Valable pendant 1 an à partir de la date de début</li>
                <li>Applicable uniquement pour les micro-entrepreneurs</li>
                <li>Les calculs de rentabilité sont automatiquement ajustés</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Sauvegarder les paramètres
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des taux */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Comparaison des taux d'imposition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border-2 ${hasAcre ? 'border-green-500 bg-green-50' : 'border-border bg-accent/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <p className="font-bold text-foreground">Avec ACRE</p>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">7%</p>
              <p className="text-sm text-muted-foreground">Taux de cotisations sociales réduit</p>
              <p className="text-xs text-muted-foreground mt-2">Sur un CA de 1000€ → 70€ de cotisations</p>
            </div>
            
            <div className={`p-4 rounded-xl border-2 ${!hasAcre ? 'border-orange-500 bg-orange-50' : 'border-border bg-accent/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <X className="h-6 w-6 text-white" />
                </div>
                <p className="font-bold text-foreground">Sans ACRE</p>
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-2">13%</p>
              <p className="text-sm text-muted-foreground">Taux de cotisations sociales standard</p>
              <p className="text-xs text-muted-foreground mt-2">Sur un CA de 1000€ → 130€ de cotisations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
