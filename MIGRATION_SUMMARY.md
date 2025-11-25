# 🎉 Migration Prisma → MongoDB + Mongoose - COMPLÉTÉE

## ✅ Résumé des Changements

### 🗑️ Supprimé
- ❌ Prisma et @prisma/client
- ❌ Dossier `prisma/` (schema.prisma, migrations)
- ❌ Fichier `src/lib/prisma.ts`
- ❌ Scripts Prisma dans package.json
- ❌ Script `setup-mongodb.js`

### ✅ Ajouté
- ✅ Packages : `mongodb` + `mongoose`
- ✅ `src/db/index.ts` - Connexion MongoDB + Mongoose
- ✅ `src/db/models/user.model.ts`
- ✅ `src/db/models/supplier-order.model.ts`
- ✅ `src/db/models/product.model.ts`
- ✅ Better Auth avec `mongodbAdapter`
- ✅ Variables d'env MongoDB (MONGODB_USERNAME, etc.)

### 📝 Documentation
- ✅ `docs/MONGODB_MIGRATION.md` - Guide complet de migration
- ✅ `server/START_HERE.md` - Démarrage rapide
- ✅ `server/README.md` - Documentation mise à jour

---

## 🏗️ Architecture MongoDB (inspirée de tamagocho)

```
server/
├── src/
│   ├── db/
│   │   ├── index.ts                      # 🔌 Connexion MongoDB + Mongoose
│   │   └── models/
│   │       ├── user.model.ts             # 👤 Modèle User
│   │       ├── supplier-order.model.ts   # 📦 Modèle SupplierOrder
│   │       └── product.model.ts          # 🛍️ Modèle Product
│   ├── auth.ts                           # 🔐 Better Auth + mongodbAdapter
│   ├── services/                         # 💼 Logique métier
│   ├── controllers/                      # 🎮 Contrôleurs HTTP
│   ├── routes/                           # 🛣️ Définition des routes
│   └── middleware/                       # ⚙️ Middleware
├── .env                                  # 🔧 Variables d'environnement
└── package.json                          # 📦 Dépendances
```

---

## 📊 Modèles Mongoose

### User
```typescript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password: String (hashed),
  hasAcre: Boolean,
  acreStartDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### SupplierOrder
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  supplier: String,
  purchaseDate: Date,
  totalCost: Number,
  shippingCost: Number,
  customsCost: Number,
  otherFees: Number,
  notes: String,
  status: 'active' | 'completed',
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  supplierOrderId: ObjectId (ref: SupplierOrder),
  name: String,
  size: String,
  quantity: Number,
  unitCost: Number,
  salePrice: Number,
  soldPrice: Number,
  status: 'in_stock' | 'listed' | 'sold',
  // + 10 autres champs
}
```

---

## 🔧 Configuration Requise

### Fichier `.env`

```env
# MongoDB Atlas
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

---

## 🚀 Commandes

```powershell
# Installation
cd server
npm install

# Développement
npm run dev        # Lance le serveur sur :5000

# Production
npm run build      # Compile TypeScript
npm run start      # Lance le serveur compilé
```

---

## 🎯 Prochaines Étapes

### 1. Configuration MongoDB Atlas
- [ ] Créer un compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Créer un cluster gratuit (M0)
- [ ] Créer un utilisateur de base de données
- [ ] Configurer l'accès réseau (0.0.0.0/0)
- [ ] Mettre à jour `.env` avec vos identifiants

### 2. Test de Connexion
```powershell
cd server
npm run dev
```

Vous devriez voir :
```
✅ Connected to MongoDB database: application-vente
✅ Mongoose connected to MongoDB database
Server running on port 5000
```

### 3. Adapter les Services Existants

**Avant (Prisma)** :
```typescript
import { prisma } from './lib/prisma'

const users = await prisma.user.findMany()
```

**Après (Mongoose)** :
```typescript
import User from './db/models/user.model'
import { connectMongooseToDatabase } from './db'

await connectMongooseToDatabase()
const users = await User.find().exec()
```

---

## 📚 Documentation

### Guides
- **[START_HERE.md](./START_HERE.md)** - Démarrage rapide (5 min)
- **[docs/MONGODB_MIGRATION.md](../docs/MONGODB_MIGRATION.md)** - Guide complet de migration
- **[README.md](./README.md)** - Documentation du serveur

### Ressources Externes
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Better Auth MongoDB Adapter](https://www.better-auth.com/docs/adapters/mongodb)
- [Projet tamagocho (référence)](https://github.com/JulesSsssssssssss/tamagocho)

---

## 🔄 Comparaison Prisma vs Mongoose

| Fonctionnalité | Prisma | Mongoose |
|----------------|--------|----------|
| **Schéma** | `schema.prisma` | Schémas TypeScript |
| **Génération** | `prisma generate` | Pas de génération |
| **Migrations** | `prisma migrate` | Pas de migrations |
| **IDs** | String (cuid) | ObjectId |
| **Relations** | Automatique | `.populate()` |
| **Type Safety** | Excellent | Bon (avec TS) |
| **Validation** | Schéma | Mongoose validators |
| **Complexité** | Abstraction forte | Plus de contrôle |

---

## 💡 Exemples de Code

### Créer un utilisateur

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
  
  return user
}
```

### Récupérer les commandes d'un utilisateur

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

### Créer un produit avec relation

```typescript
import Product from './db/models/product.model'
import { connectMongooseToDatabase } from './db'

async function createProduct(data: any) {
  await connectMongooseToDatabase()
  
  const product = await Product.create({
    userId: data.userId,
    supplierOrderId: data.orderId,
    name: data.name,
    size: data.size,
    quantity: data.quantity,
    unitCost: data.unitCost,
    salePrice: data.salePrice,
    purchaseDate: new Date(),
    status: 'in_stock',
    photos: JSON.stringify([])
  })
  
  return product
}
```

### Recherche avec filtres

```typescript
import Product from './db/models/product.model'
import { connectMongooseToDatabase } from './db'

async function searchProducts(filters: any) {
  await connectMongooseToDatabase()
  
  const query: any = {}
  
  if (filters.userId) query.userId = filters.userId
  if (filters.status) query.status = filters.status
  if (filters.minPrice) query.salePrice = { $gte: filters.minPrice }
  
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .exec()
  
  return products
}
```

---

## ⚠️ Points Importants

### 1. ObjectId vs String
```typescript
// ❌ Avant (Prisma)
const userId: string = "clxxx..."

// ✅ Après (Mongoose)
const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
const userIdString: string = userId.toString()
```

### 2. Connexion Obligatoire
```typescript
// Toujours appeler avant d'utiliser les modèles
await connectMongooseToDatabase()
```

### 3. Relations Manuelles
```typescript
// Pour charger les relations
const order = await SupplierOrder.findById(id)
  .populate('userId') // Charge les données user
  .exec()
```

### 4. JSON Arrays
```typescript
// Les photos sont stockées en JSON string
photos: JSON.stringify(['url1', 'url2'])

// Pour les récupérer
const photoUrls = JSON.parse(product.photos)
```

---

## ✅ Checklist Finale

- [x] Prisma désinstallé
- [x] MongoDB + Mongoose installés
- [x] Modèles Mongoose créés
- [x] Better Auth configuré avec mongodbAdapter
- [x] Variables d'environnement mises à jour
- [x] Documentation créée
- [ ] MongoDB Atlas configuré (À FAIRE)
- [ ] Connexion testée (À FAIRE)
- [ ] Services migrés vers Mongoose (À FAIRE)
- [ ] Tests fonctionnels (À FAIRE)

---

**🎉 Migration Terminée ! Suivez [START_HERE.md](./START_HERE.md) pour commencer.**
