# API de Gestion des Ventes

## Endpoints disponibles

### Base URL
```
http://localhost:5000/api/sales
```

## 📦 Produits

### Créer un produit
```http
POST /products
Authorization: Bearer <token>

{
  "supplierOrderId": "6744a5b8c1d2e3f4a5b6c7d8",
  "name": "Nike Air Max 90",
  "size": "42",
  "quantity": 1,
  "description": "Baskets Nike en excellent état",
  "photos": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "unitCost": 45.00,
  "purchaseDate": "2024-01-15",
  "salePrice": 89.99,
  "condition": "Neuf",
  "platform": "Vinted"
}
```

### Obtenir tous les produits (avec filtres)
```http
GET /products?status=in_stock&page=1&limit=20
Authorization: Bearer <token>

Query params disponibles:
- status: in_stock | listed | sold
- supplierOrderId: ID de la commande fournisseur
- platform: Vinted | Leboncoin | eBay
- minPrice: Prix minimum
- maxPrice: Prix maximum
- dateFrom: Date de début (ISO)
- dateTo: Date de fin (ISO)
- page: Numéro de page (défaut: 1)
- limit: Résultats par page (défaut: 50)
```

### Obtenir un produit par ID
```http
GET /products/:id
Authorization: Bearer <token>
```

### Mettre à jour un produit
```http
PUT /products/:id
Authorization: Bearer <token>

{
  "name": "Nike Air Max 90 Updated",
  "salePrice": 95.00,
  "boosted": true
}
```

### Supprimer un produit
```http
DELETE /products/:id
Authorization: Bearer <token>
```

## 🏷️ Actions de vente

### Mettre en vente un produit
```http
PUT /products/:id/list
Authorization: Bearer <token>

{
  "platform": "Vinted",
  "listedDate": "2024-01-20",
  "boosted": true
}
```

### Marquer un produit comme vendu
```http
PUT /products/:id/sell
Authorization: Bearer <token>

{
  "soldPrice": 85.00,
  "soldTo": "Jean Dupont",
  "soldDate": "2024-01-25",
  "platform": "Vinted"
}
```

### Booster/débooster un produit
```http
PUT /products/:id/boost
Authorization: Bearer <token>
```

## 📊 Statistiques

### Obtenir les statistiques de vente
```http
GET /stats
Authorization: Bearer <token>

Réponse:
{
  "stats": {
    "totalProducts": 150,
    "inStock": 45,
    "listed": 30,
    "sold": 75,
    "totalRevenue": 6250.50,
    "totalCost": 3500.00,
    "totalProfit": 2750.50,
    "averageMargin": 44.01
  }
}
```

### Obtenir les produits d'une commande fournisseur
```http
GET /supplier-orders/:id/products
Authorization: Bearer <token>
```

## 🔒 Authentification

Toutes les routes nécessitent un token JWT valide dans le header Authorization:
```
Authorization: Bearer <votre_token_jwt>
```

## 📋 Codes de statut

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non authentifié
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## 🎯 Workflow typique

1. **Créer un produit** après avoir passé une commande fournisseur
2. **Mettre en vente** le produit sur une plateforme
3. **Booster** si nécessaire pour plus de visibilité
4. **Marquer comme vendu** quand la vente est finalisée
5. **Consulter les stats** pour suivre la rentabilité

## 💡 Exemples de réponses

### Produit créé
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "6744a5b8c1d2e3f4a5b6c7d8",
    "userId": "6744a5b8c1d2e3f4a5b6c7d9",
    "supplierOrderId": "6744a5b8c1d2e3f4a5b6c7da",
    "name": "Nike Air Max 90",
    "size": "42",
    "quantity": 1,
    "photos": "[\"https://example.com/photo1.jpg\"]",
    "unitCost": 45.00,
    "salePrice": 89.99,
    "status": "in_stock",
    "boosted": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Liste de produits
```json
{
  "products": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```
