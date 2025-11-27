# Refonte Page "Nouvelle Vente" - Suivi Achat-Revente

**Date**: 26 novembre 2025  
**Objectif**: Transformer la page "Nouvel Article" en "Nouvelle Vente" pour un suivi complet de la rentabilité achat-revente

## 🎯 Contexte du Projet

Le projet est un outil de **suivi achat-revente** permettant de :
1. **Enregistrer les commandes fournisseurs** (achats en gros)
2. **Suivre les ventes au détail** (revente d'articles individuels)
3. **Calculer la rentabilité** avec/sans ACRE (charges sociales)

## 📋 Champs Ajoutés

### Informations Article
- ✅ **Description** (name) - Textarea pour description détaillée
- ✅ **Marque** (brand) - Nike, Adidas, etc.
- ✅ **Taille** (size) - M, L, 42, etc.
- ✅ **Quantité** - Nombre d'articles
- ✅ **État** (condition) - Neuf, Très bon état, etc.

### Prix et Finances
- ✅ **Prix achat unitaire** (unitCost) - Prix d'achat par unité
- ✅ **Prix total** (totalCost) - Calculé automatiquement (quantity × unitCost)
- ✅ **Date d'achat** (purchaseDate) - Auto-rempli depuis la commande fournisseur
- ✅ **Prix de vente prévu** (salePrice) - Prix de vente souhaité

### Informations de Vente
- ✅ **État de la commande** (status) - Voir statuts ci-dessous
- ✅ **Vendu à combien** (soldPrice) - Prix de vente réel
- ✅ **Date de vente** (soldDate) - Date de la transaction
- ✅ **Plateforme** (platform) - Vinted, Leboncoin, etc.
- ✅ **URL de vente** (url) - Lien vers l'annonce

### Photos
- ✅ **URLs des photos** (photos[]) - Liste d'URLs séparées par virgules

## 🏷️ Nouveaux États (Status)

| Valeur | Label | Couleur | Description |
|--------|-------|---------|-------------|
| `in_delivery` | En cours de livraison | Gris | Commande fournisseur en transit |
| `to_list` | À faire | Gris | Article à préparer pour la vente |
| `in_progress` | En cours | Bleu | Préparation en cours |
| `listed` | À mettre en vente | Jaune | Prêt à être mis en ligne |
| `for_sale` | En vente | Bleu | Annonce active sur plateforme |
| `sold` | ACHAT | Violet | Vendu (état final) |
| `problem` | Problème | Rouge | Problème rencontré |
| `sold_euros` | Vendu €€€ | Vert | Vendu avec succès |

## 💰 Calcul de Rentabilité

### Panneau Latéral - Calculs Automatiques

Le panneau affiche en temps réel :

```typescript
// Prix total achat
totalCost = quantity × unitCost

// Bénéfice sans ACRE (22% de charges)
chargesSociales = soldPrice × 0.22
profitWithoutAcre = (soldPrice - totalCost) - chargesSociales

// Bénéfice avec ACRE (11% de charges - réduction 50%)
chargesAcre = soldPrice × 0.11
profitWithAcre = (soldPrice - totalCost) - chargesAcre

// Marge brute
margin = ((soldPrice - totalCost) / soldPrice) × 100
```

### Indicateurs Visuels
- ✅ Prix en vert si bénéfice positif, rouge si négatif
- ✅ Badge ACRE affiché si `user.hasAcre === true`
- ✅ Détail des charges sociales avec/sans ACRE

## 🔧 Modifications Techniques

### Frontend (`app/`)

#### Types (`src/types/sale.ts`)
```typescript
// Nouveaux statuts
export type ProductStatus = 
  | 'in_delivery' | 'to_list' | 'in_progress' 
  | 'listed' | 'for_sale' | 'completed' 
  | 'sold' | 'problem' | 'sold_euros'

// Interface Product étendue
export interface Product {
  // ... existant
  brand?: string
  url?: string
  totalCost: number
  profitWithoutAcre?: number
  profitWithAcre?: number
  profitMargin?: number
}

// CreateProductInput mis à jour
export interface CreateProductInput {
  // ... tous les nouveaux champs
  status: ProductStatus
}
```

#### Types Auth (`src/types/auth.ts`)
```typescript
export interface User {
  id: string
  email: string
  name: string | null
  hasAcre?: boolean // Nouveau
  acreStartDate?: Date // Nouveau
}
```

#### Page (`app/(protected)/dashboard/ventes/new/page.tsx`)
- ✅ Refonte complète du formulaire
- ✅ Ajout de tous les champs
- ✅ Calculs de rentabilité en temps réel avec `useMemo`
- ✅ Auto-remplissage de la date d'achat depuis la commande
- ✅ Panneau latéral avec résumé financier
- ✅ Affichage conditionnel du badge ACRE

### Backend (`server/`)

#### Model (`src/db/models/product.model.ts`)
```typescript
export interface IProductDocument extends Document {
  // ... existant
  brand?: string
  url?: string
  totalCost: number
  status: 'in_delivery' | 'to_list' | ... // 9 statuts
}

// Schéma Mongoose mis à jour
const productSchema = new Schema<IProductDocument>({
  brand: { type: String, required: false },
  url: { type: String, required: false },
  totalCost: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['in_delivery', 'to_list', ...], 
    default: 'to_list' 
  },
  // ...
})
```

#### Service (`src/services/sale.service.ts`)
```typescript
async createProduct(userId: string, input: ICreateProductInput) {
  // Calcul automatique du coût total
  const totalCost = input.totalCost || (input.quantity * input.unitCost)
  
  const product = await ProductModel.create({
    // ... tous les nouveaux champs
    brand: input.brand,
    url: input.url,
    totalCost: totalCost,
    soldPrice: input.soldPrice,
    soldDate: input.soldDate ? new Date(input.soldDate) : undefined,
    status: input.status || 'to_list'
  })
}
```

#### Types (`src/types/sale.ts`)
- ✅ Ajout de tous les nouveaux champs dans `ISale`
- ✅ Mise à jour de `ICreateProductInput`
- ✅ Nouveaux statuts

## 🚀 Fonctionnalités

### 1. Lien avec Commande Fournisseur
Quand une commande fournisseur est sélectionnée :
- ✅ La date d'achat est automatiquement remplie avec la date de la commande
- ✅ Le lien "Ajouter un article" depuis une commande pré-remplit le formulaire

### 2. Calcul Automatique
- ✅ **Prix total** = quantity × unitCost (calculé en temps réel)
- ✅ **Bénéfices** = recalculés à chaque changement de soldPrice
- ✅ **Marge** = affichée en pourcentage

### 3. Gestion ACRE
- ✅ Vérification du statut ACRE de l'utilisateur (`user.hasAcre`)
- ✅ Affichage des deux scénarios (avec/sans ACRE)
- ✅ Badge informatif si ACRE activé

### 4. États Détaillés
- ✅ 9 états différents pour suivre le cycle de vie complet
- ✅ Codes couleur visuels (gris, bleu, jaune, vert, rouge, violet)
- ✅ Mapping avec les badges de l'image fournie

## 📝 Validation

### Champs Requis
- ✅ Commande fournisseur
- ✅ Description (name)
- ✅ Quantité > 0
- ✅ Prix d'achat > 0
- ✅ Date d'achat

### Champs Optionnels
- Marque, Taille, État, Photos, URL
- Prix de vente prévu, Vendu à combien, Date de vente
- Plateforme, Description supplémentaire

## 🔄 Workflow Utilisateur

1. **Créer une commande fournisseur** → `/dashboard/commandes/new`
2. **Depuis la commande**, cliquer "Ajouter un article"
3. **Remplir le formulaire** "Nouvelle Vente"
   - Commande pré-sélectionnée
   - Date d'achat auto-remplie
4. **Saisir les informations** de l'article
5. **Observer le calcul de rentabilité** en temps réel
6. **Mettre à jour l'état** au fur et à mesure
7. **Enregistrer le prix de vente réel** une fois vendu

## ✅ Tests à Effectuer

- [ ] Créer une nouvelle vente depuis `/dashboard/ventes/new`
- [ ] Créer une nouvelle vente depuis `/dashboard/commandes/[id]` (lien pré-rempli)
- [ ] Vérifier le calcul automatique du prix total
- [ ] Vérifier les calculs de bénéfice avec/sans ACRE
- [ ] Tester tous les états (dropdown)
- [ ] Saisir un prix de vente et vérifier les calculs
- [ ] Vérifier la redirection après création
- [ ] Tester avec un utilisateur ayant `hasAcre: true`

## 📊 Prochaines Étapes

1. **Dashboard Rentabilité** - Page dédiée aux statistiques
2. **Graphiques** - Évolution des ventes et bénéfices
3. **Export** - Exporter les données pour comptabilité
4. **Notifications** - Alertes pour articles non vendus
5. **Upload photos** - Intégration avec Cloudinary ou S3

## 🎨 Design

- ✅ Formulaire en 2 colonnes (formulaire + résumé)
- ✅ Sections organisées par cartes
- ✅ Panneau latéral avec calculs en temps réel
- ✅ Icônes Lucide pour chaque section
- ✅ Couleurs cohérentes avec la palette Kaki
- ✅ Responsive design

---

**Note**: Cette refonte transforme l'application en un véritable outil de gestion de rentabilité pour auto-entrepreneurs avec suivi détaillé des achats-reventes et calculs ACRE automatiques.
