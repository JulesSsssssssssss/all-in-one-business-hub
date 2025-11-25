# Migration Prisma → MongoDB Natif + Mongoose

## 🎯 Changements Effectués

### ✅ Suppression de Prisma
- ❌ Désinstallation de `prisma` et `@prisma/client`
- ❌ Suppression du dossier `prisma/`
- ❌ Suppression de `src/lib/prisma.ts`
- ❌ Suppression des scripts Prisma du `package.json`

### ✅ Installation MongoDB + Mongoose
- ✅ Installation de `mongodb` (driver natif)
- ✅ Installation de `mongoose` (ODM)

### ✅ Nouvelle Architecture (inspirée de tamagocho)

```
server/
├── src/
│   ├── db/
│   │   ├── index.ts                    # Connexion MongoDB + Mongoose
│   │   └── models/
│   │       ├── user.model.ts           # Modèle User
│   │       ├── supplier-order.model.ts # Modèle SupplierOrder
│   │       └── product.model.ts        # Modèle Product
│   ├── auth.ts                         # Better Auth avec mongodbAdapter
│   └── ...
```

---

## 📊 Modèles MongoDB (Mongoose)

### Collection `User`
```typescript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  name: String?,
  password: String,
  hasAcre: Boolean (default: false),
  acreStartDate: Date?,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `SupplierOrder`
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  name: String,
  supplier: String,
  purchaseDate: Date,
  totalCost: Number,
  shippingCost: Number (default: 0),
  customsCost: Number (default: 0),
  otherFees: Number (default: 0),
  notes: String?,
  status: 'active' | 'completed' (default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `Product`
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  supplierOrderId: ObjectId (ref: 'SupplierOrder'),
  name: String,
  size: String?,
  quantity: Number (default: 1),
  description: String?,
  photos: String (JSON array),
  unitCost: Number,
  purchaseDate: Date,
  salePrice: Number,
  soldPrice: Number?,
  soldTo: String?,
  status: 'in_stock' | 'listed' | 'sold' (default: 'in_stock'),
  condition: String?,
  platform: String?,
  listedDate: Date?,
  soldDate: Date?,
  boosted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Configuration MongoDB Atlas

### Variables d'environnement (.env)

```env
# MongoDB Atlas Configuration
MONGODB_USERNAME=votre_username
MONGODB_PASSWORD=votre_password
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE_NAME=application-vente
MONGODB_PARAMS=?retryWrites=true&w=majority
MONGODB_APP_NAME=ApplicationVente

# Better Auth
BETTER_AUTH_SECRET=dev-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Étapes de configuration

1. **Créer un compte MongoDB Atlas** : https://www.mongodb.com/cloud/atlas

2. **Créer un cluster gratuit (M0)**

3. **Créer un utilisateur de base de données** :
   - Allez dans "Database Access"
   - Créez un utilisateur avec mot de passe
   - Permissions : "Read and write to any database"

4. **Configurer l'accès réseau** :
   - Allez dans "Network Access"
   - Ajoutez `0.0.0.0/0` (dev) ou votre IP spécifique

5. **Obtenir les informations de connexion** :
   - Allez dans "Database" → "Connect" → "Connect your application"
   - Notez :
     - `username` (ex: `monuser`)
     - `password` (ex: `MonMotDePasse123`)
     - `host` (ex: `cluster0.abc123.mongodb.net`)

6. **Mettre à jour le fichier `.env`** avec vos identifiants

---

## 📝 Utilisation des Modèles

### Exemple : Créer un utilisateur

```typescript
import User from './db/models/user.model'
import { connectMongooseToDatabase } from './db'

async function createUser() {
  await connectMongooseToDatabase()
  
  const user = await User.create({
    email: 'test@example.com',
    name: 'Jean Dupont',
    password: 'hashed_password',
    hasAcre: false
  })
  
  console.log('User created:', user._id)
}
```

### Exemple : Récupérer les commandes d'un utilisateur

```typescript
import SupplierOrder from './db/models/supplier-order.model'
import { connectMongooseToDatabase } from './db'

async function getUserOrders(userId: string) {
  await connectMongooseToDatabase()
  
  const orders = await SupplierOrder.find({ userId })
    .sort({ createdAt: -1 })
    .exec()
  
  return orders
}
```

### Exemple : Rechercher des produits

```typescript
import Product from './db/models/product.model'
import { connectMongooseToDatabase } from './db'

async function getAvailableProducts(userId: string) {
  await connectMongooseToDatabase()
  
  const products = await Product.find({
    userId,
    status: 'in_stock'
  })
  .sort({ createdAt: -1 })
  .exec()
  
  return products
}
```

---

## 🔍 Index MongoDB

Les index suivants sont automatiquement créés par Mongoose :

### User
- `{ email: 1 }` - Recherche par email

### SupplierOrder
- `{ userId: 1, createdAt: -1 }` - Commandes d'un user triées
- `{ status: 1 }` - Filtrage par statut

### Product
- `{ userId: 1, status: 1 }` - Produits d'un user par statut
- `{ supplierOrderId: 1, status: 1 }` - Produits d'une commande
- `{ userId: 1, createdAt: -1 }` - Produits récents d'un user

---

## 🚀 Différences Prisma vs Mongoose

| Aspect | Prisma | Mongoose |
|--------|--------|----------|
| **Type** | Type-safe query builder | ODM traditionnel |
| **Schéma** | `schema.prisma` | Schémas TypeScript |
| **Migrations** | `prisma migrate` | Pas de migrations |
| **IDs** | Auto-increment (SQL) ou cuid | ObjectId MongoDB natif |
| **Relations** | Gérées par Prisma | Références manuelles |
| **Validation** | Au niveau du schéma | Mongoose validators |
| **Type safety** | Excellente | Bonne (avec TypeScript) |

---

## 🔐 Better Auth

Better Auth utilise maintenant le **mongodbAdapter** :

```typescript
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client, dbName } from './db'

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  // ...
})
```

Collections créées automatiquement par Better Auth :
- `users` - Utilisateurs authentifiés
- `sessions` - Sessions actives
- `accounts` - Comptes OAuth (si utilisé)

---

## ⚠️ Points d'Attention

### 1. ObjectId vs String
Prisma utilisait des strings (`cuid()`), MongoDB utilise `ObjectId`.

**Avant (Prisma)** :
```typescript
id: string // "clxxx..."
```

**Après (Mongoose)** :
```typescript
_id: mongoose.Types.ObjectId
// Conversion : _id.toString()
```

### 2. Relations
Prisma gérait les relations automatiquement. Avec Mongoose, il faut utiliser `.populate()`.

**Exemple** :
```typescript
const order = await SupplierOrder.findById(orderId)
  .populate('userId') // Charge les données user
  .exec()
```

### 3. Timestamps
Mongoose ajoute automatiquement `createdAt` et `updatedAt` avec `{ timestamps: true }`.

### 4. Validation
Les validations sont définies dans les schémas Mongoose :
```typescript
unitCost: {
  type: Number,
  required: true,
  min: 0
}
```

---

## 📚 Ressources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Better Auth MongoDB Adapter](https://www.better-auth.com/docs/adapters/mongodb)
- [Projet tamagocho (référence)](https://github.com/JulesSsssssssssss/tamagocho)

---

## ✅ Checklist de Migration

- [x] Désinstaller Prisma
- [x] Installer MongoDB + Mongoose
- [x] Créer `src/db/index.ts`
- [x] Créer les modèles Mongoose
- [x] Mettre à jour Better Auth
- [x] Mettre à jour `.env` et `.env.example`
- [x] Retirer les scripts Prisma du `package.json`
- [ ] Configurer MongoDB Atlas
- [ ] Tester la connexion
- [ ] Migrer les services existants
- [ ] Tester l'authentification
- [ ] Tester les opérations CRUD

---

**✨ Votre backend utilise maintenant MongoDB natif comme le projet tamagocho !**
